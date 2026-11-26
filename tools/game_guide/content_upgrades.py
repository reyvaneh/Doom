"""Study guide visual enhancements (real photographs and instructional diagrams).

Layers real hardware, networking, and robotics photographs plus instructional
diagrams onto extracted chapters while keeping all Test Bank questions and all
48 chapter review questions 100% unchanged from the original source.
"""
import base64
import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
PHOTOS_DIR = ROOT / "videos/v2_assets/real_photos"
LM_DIR = ROOT / "Learning Materials"
RENDERS_DIR = ROOT / "videos/v2_assets/renders/_preview"

# Rich visual figures per chapter (inserted cleanly into target section indices)
CHAPTER_FIGURES = {
    1: [
        (0, "real_photos/cpu_intel_chip.jpg", "photo-fig", "Physical desktop CPU package showing the integrated heatspreader and alignment notches; inside lies the processor executing the fetch-decode-execute loop."),
        (1, "real_photos/ram_dimm.png", "photo-fig", "16 GiB DDR4 RAM module. DRAM chips on the PCB hold active programs and unsaved edits transiently as capacitor charges that vanish when power drops."),
        (2, "real_photos/nvme_ssd.jpg", "photo-fig", "M.2 NVMe solid-state drive. Non-volatile NAND flash packages retain files, photos, and firmware even when powered off."),
    ],
    2: [
        (0, "real_photos/ic_microchip.jpg", "photo-fig", "Microscope view inside an uncovered integrated circuit die showing silicon logic/memory regions connected by fine perimeter bond wires."),
    ],
    3: [
        (0, "real_photos/ethernet_rj45.jpg", "photo-fig", "Category twisted-pair Ethernet patch cable with translucent RJ45 plug exposing the eight copper conductors."),
        (-1, "real_photos/router_home.jpg", "photo-fig", "Home wireless router bridging switched LAN Ethernet ports (1 to 4), WLAN antennas, and the uplink WAN gateway port."),
    ],
    4: [
        (-1, "lm:Network/computernetwork1.jpg", "photo-fig", "Structured data-center server cabinets where high-density fiber and patch uplinks route requests between client browsers and web servers."),
    ],
    5: [
        (-1, "real_photos/roomba_unit.jpg", "photo-fig", "Real autonomous robotic vacuum showing its curved mechanical front bump skirt and forward IR obstacle/dock window."),
    ],
    6: [
        (-1, "real_photos/quadcopter_real.jpg", "photo-fig", "Autonomous multi-rotor drone balancing attitude and stabilization loops rapidly using IMU sensor feedback."),
    ],
    7: [
        (0, "real_photos/cpu_die.jpg", "photo-fig", "High-density motherboard LGA processor socket contacts linking CPU address, data, and control pins to board traces."),
        (-1, "lm:Hardware/images/von-neumann-vs-harvard.svg", "svg-fig", "Architectural comparison: shared instruction/data memory bus (von Neumann) versus physically split program and data buses (Harvard)."),
    ],
    8: [
        (0, "real_photos/breadboard_real.jpg", "photo-fig", "Real solderless breadboard prototype wired with pushbutton switches, LEDs, current-limiting resistor, and battery feed."),
        (1, "real_photos/multimeter_real.jpg", "photo-fig", "Bench digital multimeter alongside an oscilloscope measuring live voltage rails, waveforms, and load current."),
        (-1, "real_photos/resistor_array.jpg", "photo-fig", "Axial through-hole carbon/metal film resistors showing distinct four-band digit, multiplier, and tolerance markings."),
    ],
    9: [
        (0, "real_photos/ldr_real.jpg", "photo-fig", "Close-up of a Cadmium-Sulfide (CdS) photoresistor (LDR) whose serpentine semiconductor track decreases resistance as light hits it."),
        (-1, "real_photos/motor_hbridge.png", "photo-fig", "L298N H-bridge motor driver module routing high motor currents across OUT1-OUT4 under logic signals from a 5 V microcontroller."),
    ],
    10: [
        (0, "lm:Hardware/images/serial-buses.svg", "svg-fig", "Comparing synchronous and asynchronous chip interfaces: UART point-to-point, two-wire I2C shared bus, and high-speed SPI."),
        (-1, "lm:Hardware/images/datasheet-margins.svg", "svg-fig", "Derating principle: keep normal continuous operating current and voltage safely inside nominal envelopes well below Absolute Maximum Ratings."),
        (-1, "real_photos/pcb_board.jpg", "photo-fig", "Surface-mount printed circuit board populated with integrated circuits and nearby ceramic decoupling capacitors filtering switching transients."),
    ],
    11: [
        (-1, "real_photos/patch_panel_real.jpg", "photo-fig", "Enterprise network patch rack terminating dozens of numbered wall drops directly into central rack switches."),
    ],
    12: [
        (-1, "real_photos/fiber_comm_real.jpg", "photo-fig", "Optical fiber distribution enclosure carrying high-bandwidth trunk links into managed rack switches and routers."),
    ],
    13: [
        (-1, "real_photos/industrial_robot_real.jpg", "photo-fig", "Industrial articulated manipulator operating across repeatable discrete state-action sequences in a structured workcell."),
    ],
    14: [
        (-1, "render:maze_f001.png", "photo-fig", "3D autonomous agent grid environment illustrating states, barrier walls, and target goals navigated via learned Q-values."),
    ],
    15: [
        (0, "real_photos/robot_vacuum_real.jpg", "photo-fig", "Partial observability in practice: a cleaning robot wedged beneath a chair whose forward bumper missed the thin sloped frame."),
        (-1, "real_photos/mars_rover_real.jpg", "photo-fig", "NASA Perseverance Rover on Mars: extreme round-trip light-speed delay forces autonomous local obstacle reflexes and strict field validation."),
        (-1, "lm:AIBehaviour/assets/learning-loop.png", "svg-fig", "Reinforcement learning update cycle: observation -> action -> reward feedback updates value estimates to refine future policy choices."),
    ],
    16: [
        (0, "lm:AIBehaviour/assets/perception-action-loop.png", "svg-fig", "Closed-loop cyber-physical control integrating sensing, local reactive decision layers, and actuator execution."),
        (-1, "real_photos/oscilloscope_real.jpg", "photo-fig", "Analog waveform capture on an oscilloscope bench monitor verifying clean switching transitions and noise suppression."),
    ],
}


def _encode_asset(rel_spec: str) -> str | None:
    if rel_spec.startswith("lm:"):
        path = LM_DIR / rel_spec[3:]
    elif rel_spec.startswith("render:"):
        path = RENDERS_DIR / rel_spec[7:]
    else:
        path = ROOT / "videos/v2_assets" / rel_spec
    if not path.exists():
        return None
    if path.suffix.lower() == ".svg":
        b64 = base64.b64encode(path.read_bytes()).decode("ascii")
        return f"data:image/svg+xml;base64,{b64}"
    im = Image.open(path)
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im.convert("RGBA"), mask=im.convert("RGBA").split()[-1])
        im = bg
    else:
        im = im.convert("RGB")
    max_w = 1040
    if im.width > max_w:
        nh = int(im.height * (max_w / im.width))
        im = im.resize((max_w, nh), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="JPEG", quality=83, optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/jpeg;base64,{b64}"


def apply(model: dict, assets) -> None:
    """Inject visual figures into sparse chapters without changing any questions."""
    for ch in model["chapters"]:
        secs = ch["sections"]
        if not secs:
            continue
        for sec_idx, rel_path, css_cls, caption in CHAPTER_FIGURES.get(ch["n"], []):
            uri = _encode_asset(rel_path)
            if not uri:
                continue
            idx = sec_idx if sec_idx >= 0 else max(0, len(secs) + sec_idx)
            idx = min(idx, len(secs) - 1)
            key = assets.key(uri)
            fig_html = (
                f'<figure class="diagram {css_cls}">'
                f'<img src="asset:{key}" alt="{caption}">'
                f'<figcaption>{caption}</figcaption>'
                f"</figure>"
            )
            secs[idx]["html"] = secs[idx]["html"].rstrip() + "\n" + fig_html
