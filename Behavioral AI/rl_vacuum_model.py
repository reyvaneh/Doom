"""Two-tile teaching MDP and scripted Q-learning replay, not a training trial."""

from collections import defaultdict
from itertools import product
from math import isclose

ACTIONS = ("SUCK", "RIGHT", "LEFT", "WAIT")  # Also the greedy tie order.
START = ("A", 1, 1)
ALPHA = 0.5
GAMMA = 0.9


def terminal(state):
    return state[1:] == (0, 0)


def step(state, action):
    assert state[0] in ("A", "B") and state[1] in (0, 1) and state[2] in (0, 1)
    assert action in ACTIONS
    if terminal(state):
        raise ValueError("Episode has ended; reset before acting again.")
    position, dirt_a, dirt_b = state
    reward = -1
    if action == "LEFT":
        position = "A"
    elif action == "RIGHT":
        position = "B"
    elif action == "SUCK":
        if position == "A" and dirt_a:
            dirt_a = 0
            reward += 5
        elif position == "B" and dirt_b:
            dirt_b = 0
            reward += 5
    next_state = (position, dirt_a, dirt_b)
    if terminal(next_state):
        reward += 6
    return next_state, reward


def choose(q, state, rng, epsilon=0.2):
    if terminal(state):
        raise ValueError("No action in a terminal state.")
    if rng.random() < epsilon:
        return rng.choice(ACTIONS)
    return max(ACTIONS, key=lambda action: q[state, action])


def update(q, state, action, reward, next_state):
    old = q[state, action]
    best_next = 0.0 if terminal(next_state) else max(q[next_state, a] for a in ACTIONS)
    target = reward + GAMMA * best_next
    q[state, action] = old + ALPHA * (target - old)
    return old, best_next, target, q[state, action]


def check_model():
    count = 0
    for state in product(("A", "B"), (0, 1), (0, 1)):
        if terminal(state):
            for action in ACTIONS:
                try:
                    step(state, action)
                except ValueError:
                    pass
                else:
                    raise AssertionError("Terminal state allowed another action.")
            continue
        for action in ACTIONS:
            after, reward = step(state, action)
            assert after[0] in ("A", "B")
            assert after[1] <= state[1] and after[2] <= state[2]
            removed = sum(state[1:]) - sum(after[1:])
            assert removed in (0, 1)
            assert reward == -1 + 5 * removed + 6 * int(terminal(after))
            if action != "SUCK":
                assert state[1:] == after[1:]
            count += 1

    q = defaultdict(float)
    expected = (
        (0, 0, 4, 2), (0, 0, -1, -0.5), (0, 0, 10, 5),
        (2, 0, 4, 3), (-0.5, 5, 3.5, 1.5), (5, 0, 10, 7.5),
    )
    rows = []
    first_rewards = []
    for episode in range(2):
        state = START  # Environment reset; Q-values retained.
        for action in ("SUCK", "RIGHT", "SUCK"):
            after, reward = step(state, action)
            row = update(q, state, action, reward, after)
            rows.append(row)
            if episode == 0:
                first_rewards.append(reward)
            state = after
        assert terminal(state)
    for got, wanted in zip(rows, expected):
        assert all(isclose(x, y) for x, y in zip(got, wanted)), (got, wanted)
    total_return = sum(GAMMA ** i * r for i, r in enumerate(first_rewards))
    assert isclose(total_return, 11.2)
    import random
    assert choose(q, ("A", 0, 1), random.Random(0), epsilon=0) == "RIGHT"
    assert step(("A", 0, 1), "SUCK") == (("A", 0, 1), -1)
    print(f"Passed: {count} nonterminal state-action transitions; terminal guards; 6 scripted Q updates; return {total_return:.1f}.")
    print("Scripted educational replay only; no random training, convergence or physical performance result.")


if __name__ == "__main__":
    check_model()
