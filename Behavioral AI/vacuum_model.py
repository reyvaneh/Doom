"""Original, ideal corridor teaching model. No hardware or learner trial.

Run this file to check the chapter's trace and finite model consistency.
Inputs are exact observations. Mode transitions precede one action per tick.
"""

from dataclasses import dataclass, replace
from itertools import product

MODES = ("CLEAN", "RETURN", "CHARGE")


@dataclass(frozen=True)
class World:
    x: int = 2
    b: int = 6
    dirt: frozenset[int] = frozenset({1, 2, 3})
    mode: str = "CLEAN"


def choose(x, b, dirty, left_clear, right_clear, mode):
    """Return (mode used for this tick, action), using only observations."""
    if mode == "CHARGE" and x != 0:
        return mode, "WAIT"
    if b == 0 and x != 0:
        return mode, "WAIT"
    if mode == "CLEAN" and b <= 3:
        mode = "RETURN"
    if mode == "RETURN" and x == 0:
        mode = "CHARGE"
    if mode == "CHARGE" and b == 10:
        mode = "CLEAN"
    if mode == "CHARGE":
        return mode, "CHARGE" if x == 0 else "WAIT"
    if mode == "RETURN":
        return mode, "LEFT" if x > 0 and left_clear else "WAIT"
    if dirty:
        return mode, "SUCK"
    if x < 3 and right_clear:
        return mode, "RIGHT"
    if x > 0 and left_clear:
        return mode, "LEFT"
    return mode, "WAIT"


def step(world, barriers=frozenset()):
    """Barrier i blocks the undirected edge between tiles i and i+1."""
    assert 0 <= world.x <= 3 and 0 <= world.b <= 10
    assert world.mode in MODES and world.dirt <= frozenset(range(4))
    assert barriers <= frozenset(range(3))
    left_clear = world.x > 0 and world.x - 1 not in barriers
    right_clear = world.x < 3 and world.x not in barriers
    mode, action = choose(
        world.x, world.b, world.x in world.dirt,
        left_clear, right_clear, world.mode,
    )
    result = replace(world, mode=mode)
    if action in ("LEFT", "RIGHT", "SUCK"):
        assert world.b >= 1
        result = replace(result, b=world.b - 1)
    if action == "LEFT":
        assert left_clear
        result = replace(result, x=world.x - 1)
    elif action == "RIGHT":
        assert right_clear
        result = replace(result, x=world.x + 1)
    elif action == "SUCK":
        result = replace(result, dirt=world.dirt - {world.x})
    elif action == "CHARGE":
        assert world.x == 0
        result = replace(result, b=min(10, world.b + 2))
    else:
        assert action == "WAIT"
    return action, result


def check_model():
    # Expected results transcribed from the teaching chapter, including mode timing.
    expected = [
        ("SUCK", 2, 5, "CLEAN"), ("RIGHT", 3, 4, "CLEAN"),
        ("SUCK", 3, 3, "CLEAN"), ("LEFT", 2, 2, "RETURN"),
        ("LEFT", 1, 1, "RETURN"), ("LEFT", 0, 0, "RETURN"),
        ("CHARGE", 0, 2, "CHARGE"), ("CHARGE", 0, 4, "CHARGE"),
        ("CHARGE", 0, 6, "CHARGE"), ("CHARGE", 0, 8, "CHARGE"),
        ("CHARGE", 0, 10, "CHARGE"), ("RIGHT", 1, 9, "CLEAN"),
        ("SUCK", 1, 8, "CLEAN"),
    ]
    world = World()
    for tick, row in enumerate(expected):
        action, result = step(world)
        assert (action, result.x, result.b, result.mode) == row, (tick, result)
        world = result
    assert world.dirt == frozenset()

    # Exhaust all represented positions, energy levels, dirt maps, modes and barriers.
    count = 0
    for x, b, dirt_mask, mode, edge_mask in product(
        range(4), range(11), range(16), MODES, range(8)
    ):
        dirt = frozenset(i for i in range(4) if dirt_mask & (1 << i))
        barriers = frozenset(i for i in range(3) if edge_mask & (1 << i))
        before = World(x, b, dirt, mode)
        action, after = step(before, barriers)
        assert 0 <= after.x <= 3 and 0 <= after.b <= 10
        assert after.mode in MODES
        assert after.dirt <= before.dirt
        if action != "SUCK":
            assert after.dirt == before.dirt
        if b == 0 and x != 0:
            assert action == "WAIT" and after == before
        if mode == "CHARGE" and x != 0:
            assert action == "WAIT" and after == before
        count += 1

    # Return bound: enough energy for the unobstructed distance, then charging.
    for x in range(1, 4):
        for b in range(x, 4):
            world = World(x=x, b=b, mode="RETURN")
            for _ in range(x):
                action, world = step(world)
                assert action == "LEFT"
            assert world.x == 0
            action, world = step(world)
            assert action == "CHARGE"

    # Distinct stored modes, identical observations.
    assert step(World(x=2, b=4, mode="CLEAN"))[0] == "SUCK"
    assert step(World(x=2, b=4, mode="RETURN"))[0] == "LEFT"
    action, blocked = step(World(x=3, b=3), frozenset({2}))
    assert action == "WAIT" and blocked.mode == "RETURN"
    assert step(blocked, frozenset({2})) == ("WAIT", blocked)
    _, stranded = step(World(x=3, b=1))
    assert (stranded.x, stranded.b) == (2, 0)
    assert step(stranded)[0] == "WAIT"
    world = World(x=2, b=10, dirt=frozenset())
    action, world = step(world)
    assert action == "RIGHT" and world.x == 3
    action, world = step(world)
    assert action == "LEFT" and world.x == 2
    print(f"Passed: 13 trace ticks; {count} finite configurations; return bound and counterexamples.")
    print("These checks cover only the stated discrete model, not physical robot safety or learner results.")


if __name__ == "__main__":
    check_model()
