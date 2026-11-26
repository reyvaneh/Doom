"""Upgrade DOOM_Stage2_PPT_V1.pptx into DOOM_Stage2_PPT_V2.pptx.

Improvements aligned with reviewer feedback:
1. Embed 24+ verified real hardware, networking, and robotics photographs into
   existing slide layouts with aspect-preserving center crops and zero overlap.
2. Add native OOXML click-paced entrance animations (<p:timing>) across
   teaching, diagram, poll, and reveal slides (preserving existing video
   slides S17, S45, S82) plus gentle section divider transitions.
3. Update slide version metadata and fix leaked question ID "(MC08)" on S38.
"""
import copy
import io
import os
from pathlib import Path

from lxml import etree
from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
SRC_PPT = ROOT / "DOOM_Stage2_PPT_V1.pptx"
DST_PPT = ROOT / "DOOM_Stage2_PPT_V2.pptx"
PHOTOS = ROOT / "videos/v2_assets/real_photos"
LM = ROOT / "Learning Materials"

P_NS = "http://schemas.openxmlformats.org/presentationml/2006/main"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
P = f"{{{P_NS}}}"
A = f"{{{A_NS}}}"

CREAM_CARD = RGBColor(0xEF, 0xE8, 0xD6)
INK_DARK = RGBColor(0x1F, 0x25, 0x21)
RULE_GOLD = RGBColor(0xC9, 0xB9, 0x8D)


def crop_for_box(img_path: Path, box_w_in: float, box_h_in: float, target_dpi: int = 180, contain: bool = False) -> io.BytesIO:
    """Crop or pad-contain image to exact box aspect ratio so PowerPoint never distorts it."""
    im = Image.open(img_path)
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        bg = Image.new("RGB", im.size, (245, 240, 230))
        bg.paste(im.convert("RGBA"), mask=im.convert("RGBA").split()[-1])
        im = bg
    else:
        im = im.convert("RGB")

    src_w, src_h = im.size
    target_ar = box_w_in / box_h_in
    src_ar = src_w / src_h

    if contain:
        out_w = max(320, min(1400, int(round(box_w_in * target_dpi))))
        out_h = max(180, int(round(out_w / target_ar)))
        scale = min(out_w / src_w, out_h / src_h)
        nw, nh = max(1, int(round(src_w * scale))), max(1, int(round(src_h * scale)))
        im_resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (out_w, out_h), (247, 243, 234))
        canvas.paste(im_resized, ((out_w - nw) // 2, (out_h - nh) // 2))
        im = canvas
    else:
        if src_ar > target_ar:
            new_w = int(round(src_h * target_ar))
            left = (src_w - new_w) // 2
            im = im.crop((left, 0, left + new_w, src_h))
        elif src_ar < target_ar:
            new_h = int(round(src_w / target_ar))
            top = (src_h - new_h) // 2
            im = im.crop((0, top, src_w, top + new_h))

        out_w = max(320, min(1400, int(round(box_w_in * target_dpi))))
        out_h = max(180, int(round(out_w / target_ar)))
        im = im.resize((out_w, out_h), Image.Resampling.LANCZOS)

    buf = io.BytesIO()
    im.save(buf, format="JPEG", quality=91)
    buf.seek(0)
    return buf


def add_photo(slide, img_path: Path, left: float, top: float, width: float, height: float, caption: str | None = None, contain: bool = False):
    """Place an aspect-preserved real photograph with optional high-contrast caption pill below."""
    cap_h = 0.28 if caption else 0.0
    pic_h = max(0.5, height - cap_h)
    stream = crop_for_box(img_path, width, pic_h, contain=contain)
    pic = slide.shapes.add_picture(stream, Inches(left), Inches(top), Inches(width), Inches(pic_h))
    pic.line.color.rgb = RULE_GOLD
    pic.line.width = Pt(0.75)
    shapes = [pic]
    if caption:
        tb = slide.shapes.add_textbox(Inches(left), Inches(top + pic_h), Inches(width), Inches(cap_h))
        tb.fill.solid()
        tb.fill.fore_color.rgb = CREAM_CARD
        tb.line.color.rgb = RULE_GOLD
        tb.line.width = Pt(0.5)
        tf = tb.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        tf.margin_left = Inches(0.06)
        tf.margin_right = Inches(0.06)
        tf.margin_top = Inches(0.02)
        tf.margin_bottom = Inches(0.02)
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = caption
        r.font.name = "Segoe UI"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = INK_DARK
        shapes.append(tb)
    return shapes


def set_box(sh, left=None, top=None, width=None, height=None, font_pt=None):
    if left is not None:
        sh.left = Inches(left)
    if top is not None:
        sh.top = Inches(top)
    if width is not None:
        sh.width = Inches(width)
    if height is not None:
        sh.height = Inches(height)
    if font_pt is not None and sh.has_text_frame:
        for p in sh.text_frame.paragraphs:
            for r in p.runs:
                r.font.size = Pt(font_pt)


def remove_shape(sh):
    el = sh._element
    el.getparent().remove(el)


def scale_table_width(table_shape, new_width_in: float, font_pt: float | None = None):
    old_w = table_shape.width / 914400.0
    ratio = new_width_in / old_w
    table_shape.width = Inches(new_width_in)
    tbl = table_shape.table
    for col in tbl.columns:
        col.width = int(round(col.width * ratio))
    if font_pt is not None:
        for row in tbl.rows:
            for cell in row.cells:
                for p in cell.text_frame.paragraphs:
                    for r in p.runs:
                        r.font.size = Pt(font_pt)


def add_fade_transition(slide):
    """Insert a subtle smooth fade transition strictly in valid OOXML cSld-clrMapOvr-transition-timing order."""
    sld = slide._element
    for existing in list(sld.findall(f"{P}transition")):
        sld.remove(existing)
    tr = etree.Element(f"{P}transition", spd="med")
    etree.SubElement(tr, f"{P}fade")
    clr = sld.find(f"{P}clrMapOvr")
    if clr is not None:
        clr.addnext(tr)
    else:
        csld = sld.find(f"{P}cSld")
        csld.addnext(tr)


def apply_real_photos_and_cleanups(prs):
    # Global metadata + cleanups across slides
    for idx, slide in enumerate(prs.slides, 1):
        for sh in slide.shapes:
            if not sh.has_text_frame:
                continue
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    if idx == 1 and "Version 1.0" in r.text:
                        r.text = r.text.replace("Version 1.0", "Version 2.0")
                    if "STAGE 2 PPT V1" in r.text:
                        r.text = r.text.replace("STAGE 2 PPT V1", "STAGE 2 PPT V2")
                    if idx == 38 and " (MC08)" in r.text:
                        r.text = r.text.replace(" (MC08)", "")

    s = prs.slides
    added_by_slide = {}

    def track(snum, shapes_list):
        added_by_slide.setdefault(snum, []).extend(shapes_list)

    # S08: 2:00 AM blackout - show SSD vs RAM right inside cards (contain-fit preserves gold pins!)
    s8 = s[7]
    set_box(s8.shapes[6], height=2.45)
    set_box(s8.shapes[7], top=3.08, height=0.45)
    set_box(s8.shapes[8], top=3.52, height=0.45, font_pt=14.5)
    set_box(s8.shapes[9], height=2.45)
    set_box(s8.shapes[10], top=3.08, height=0.45)
    set_box(s8.shapes[11], top=3.52, height=0.45, font_pt=14.5)
    set_box(s8.shapes[12], top=5.62, height=0.75)
    track(8, add_photo(s8, PHOTOS / "nvme_ssd.jpg", 0.85, 4.02, 5.30, 1.32, "NVMe SSD (keeps data off power)", contain=True))
    track(8, add_photo(s8, PHOTOS / "ram_dimm.png", 7.18, 4.02, 5.30, 1.32, "DDR4 RAM (loses data without power)", contain=True))

    # S10: Inside the kitchen (CPU / RAM / SSD cards) - resolve shape refs before removing glyphs
    s10 = s[9]
    s10_specs = [
        (s10.shapes[3], s10.shapes[4], s10.shapes[5], s10.shapes[6], s10.shapes[7], "cpu_intel_chip.jpg", False),
        (s10.shapes[8], s10.shapes[9], s10.shapes[10], s10.shapes[11], s10.shapes[12], "ram_dimm.png", True),
        (s10.shapes[13], s10.shapes[14], s10.shapes[15], s10.shapes[16], s10.shapes[17], "nvme_ssd.jpg", True),
    ]
    for card, ico, title, sub, body, img_fn, use_contain in s10_specs:
        cx = card.left / 914400.0
        cw = card.width / 914400.0
        set_box(card, height=3.12)
        remove_shape(ico)
        track(10, add_photo(s10, PHOTOS / img_fn, cx + 0.22, 2.12, cw - 0.44, 1.18, contain=use_contain))
        set_box(title, left=cx + 0.22, top=3.36, width=cw - 0.44, height=0.40)
        set_box(sub, left=cx + 0.22, top=3.74, width=cw - 0.44, height=0.35)
        set_box(body, left=cx + 0.22, top=4.12, width=cw - 0.44, height=0.92, font_pt=14)

    # S11: Memory hierarchy - real silicon die in upper right whitespace (below header bar at y=2.20)
    track(11, add_photo(s[10], PHOTOS / "ic_microchip.jpg", 9.95, 2.26, 2.78, 1.66, "Silicon die: on-chip registers & cache"))

    # S20: Breadboard internal wiring - real breadboard below bullets on right with clean gap
    s20 = s[19]
    set_box(s20.shapes[180], top=1.96, height=2.55, font_pt=15.5)
    track(20, add_photo(s20, PHOTOS / "breadboard_real.jpg", 7.35, 4.78, 5.10, 2.00, "Real solderless breadboard prototype"))

    # S23: Multimeter's three modes - explicit column widths keep "Unpowered" on one line
    s23 = s[22]
    scale_table_width(s23.shapes[3], 8.05, font_pt=13)
    for ci, cw in enumerate([1.62, 2.50, 1.40, 2.53]):
        s23.shapes[3].table.columns[ci].width = Inches(cw)
    track(23, add_photo(s23, PHOTOS / "multimeter_real.jpg", 8.90, 2.05, 3.83, 3.05, "Bench multimeter & oscilloscope"))

    # S24: Resistor color bands - real macro axial resistor array in lower right box
    s24 = s[23]
    set_box(s24.shapes[22], left=9.18, top=2.30, width=3.38, height=1.10, font_pt=14.5)
    track(24, add_photo(s24, PHOTOS / "resistor_array.jpg", 9.18, 3.44, 3.38, 1.65, "Real 4-band axial resistors"))

    # S32: Chip interfaces UART / I2C / SPI - narrow table & stack oscilloscope + PCB trace photos
    s32 = s[31]
    scale_table_width(s32.shapes[3], 8.20, font_pt=12.5)
    track(32, add_photo(s32, PHOTOS / "oscilloscope_real.jpg", 9.05, 2.05, 3.68, 1.82, "Clock & pulsed waveforms on scope"))
    track(32, add_photo(s32, PHOTOS / "pcb_board.jpg", 9.05, 4.00, 3.68, 1.82, "PCB bus traces linking IC chips"))

    # S34: Decoupling & Repair cards - add macro motherboard SMDs & PCB right inside two opposing cards
    s34 = s[33]
    set_box(s34.shapes[4], width=3.45)
    set_box(s34.shapes[5], width=3.45, font_pt=13.5)
    track(34, add_photo(s34, LM / "Network/computernetwork2.jpg", 4.45, 2.15, 1.92, 1.92, "SMD bypass caps"))
    set_box(s34.shapes[13], width=3.45)
    set_box(s34.shapes[14], width=3.45, font_pt=13.5)
    track(34, add_photo(s34, PHOTOS / "pcb_board.jpg", 10.65, 4.65, 1.92, 1.92, "Modular PCB design"))

    # S48: Packet across two networks - patch panel photo below bottom-right callout
    s48 = s[47]
    set_box(s48.shapes[19], top=3.88, height=1.22, font_pt=13)
    track(48, add_photo(s48, PHOTOS / "patch_panel_real.jpg", 8.35, 5.14, 4.38, 1.66, "Switch & router rack patch panel"))

    # S51: TCP vs UDP - fill spacious lower halves of TCP and UDP cards with matching real photos
    s51 = s[50]
    set_box(s51.shapes[5], height=2.10, font_pt=14.5)
    track(51, add_photo(s51, LM / "Network/computernetwork1.jpg", 0.82, 4.86, 4.06, 1.72, "TCP: web servers, file transfers & mail"))
    set_box(s51.shapes[8], height=2.10, font_pt=14.5)
    track(51, add_photo(s51, PHOTOS / "quadcopter_real.jpg", 5.57, 4.86, 4.06, 1.72, "UDP: live video, drone control & voice"))

    # S55: DHCP & NAT - home wireless router beside NAT table & note
    s55 = s[54]
    set_box(s55.shapes[17], left=7.20, top=4.22, width=2.85, height=2.55, font_pt=13.5)
    track(55, add_photo(s55, PHOTOS / "router_home.jpg", 10.18, 4.28, 2.55, 2.42, "Home Wi-Fi & NAT router"))

    # S56: Keeping conversation private - add Ethernet cable (Firewall) & fiber rack (VPN)
    s56 = s[55]
    set_box(s56.shapes[4], width=3.45)
    set_box(s56.shapes[5], width=3.45, font_pt=13.5)
    track(56, add_photo(s56, PHOTOS / "ethernet_rj45.jpg", 4.45, 2.15, 1.92, 1.90, "LAN/WAN interface"))
    set_box(s56.shapes[13], width=3.45)
    set_box(s56.shapes[14], width=3.45, font_pt=13.5)
    track(56, add_photo(s56, PHOTOS / "fiber_comm_real.jpg", 10.65, 4.60, 1.92, 1.90, "ISP encrypted trunk"))

    # S60: Three schools of AI - add real robot photos to top of Symbolism/Connectionism/Behaviorism cards
    s60 = s[59]
    for card_i, h_i, sub_i, b1_i, b2_i, fn in [
        (3, 4, 5, 6, 7, "industrial_robot_real.jpg"),
        (8, 9, 10, 11, 12, "quadcopter_real.jpg"),
        (13, 14, 15, 16, 17, "roomba_unit.jpg"),
    ]:
        c = s60.shapes[card_i]
        cx = c.left / 914400.0
        cw = c.width / 914400.0
        set_box(c, height=3.75)
        track(60, add_photo(s60, PHOTOS / fn, cx + 0.22, 2.10, cw - 0.44, 1.32))
        set_box(s60.shapes[h_i], left=cx + 0.22, top=3.48, width=cw - 0.44, height=0.40)
        set_box(s60.shapes[sub_i], left=cx + 0.22, top=3.86, width=cw - 0.44, height=0.32)
        set_box(s60.shapes[b1_i], left=cx + 0.22, top=4.22, width=cw - 0.44, height=0.88, font_pt=13.5)
        set_box(s60.shapes[b2_i], left=cx + 0.22, top=5.08, width=cw - 0.44, height=0.58, font_pt=12.5)

    # S67: Finite state machine - real robot vacuum bottom-right
    track(67, add_photo(s[66], PHOTOS / "roomba_unit.jpg", 10.02, 4.58, 2.71, 1.48, "Roomba dock & bumper states"))

    # S85: Where simple models break - resolve shape refs before removing circles [4],[9],[14]
    s85 = s[84]
    s85_specs = [
        (s85.shapes[3], s85.shapes[4], s85.shapes[5], s85.shapes[6], s85.shapes[7], "robot_vacuum_real.jpg"),
        (s85.shapes[8], s85.shapes[9], s85.shapes[10], s85.shapes[11], s85.shapes[12], "multimeter_real.jpg"),
        (s85.shapes[13], s85.shapes[14], s85.shapes[15], s85.shapes[16], s85.shapes[17], "mars_rover_real.jpg"),
    ]
    for c, badge, h, body, ref, fn in s85_specs:
        cx = c.left / 914400.0
        cw = c.width / 914400.0
        remove_shape(badge)
        track(85, add_photo(s85, PHOTOS / fn, cx + 0.22, 2.12, cw - 0.44, 1.42))
        set_box(h, left=cx + 0.22, top=3.60, width=cw - 0.44, height=0.52, font_pt=17)
        set_box(body, left=cx + 0.22, top=4.14, width=cw - 0.44, height=1.42, font_pt=13)
        set_box(ref, left=cx + 0.22, top=5.65, width=cw - 0.44, height=0.35)

    # S92: Finale Answer B (BODY / BRAIN / VOICE) - top hardware/robot/router real photos in 3 cards
    s92 = s[91]
    for card_i, h_i, body_i, path_obj in [
        (4, 5, 6, LM / "Hardware/arduino-uno.jpg"),
        (7, 8, 9, PHOTOS / "roomba_unit.jpg"),
        (10, 11, 12, PHOTOS / "router_home.jpg"),
    ]:
        c = s92.shapes[card_i]
        cx = c.left / 914400.0
        cw = c.width / 914400.0
        track(92, add_photo(s92, path_obj, cx + 0.22, 2.95, cw - 0.44, 1.24))
        set_box(s92.shapes[h_i], left=cx + 0.22, top=4.24, width=cw - 0.44, height=0.40)
        set_box(s92.shapes[body_i], left=cx + 0.22, top=4.64, width=cw - 0.44, height=1.22, font_pt=13)

    return added_by_slide


def _is_chrome(sh) -> bool:
    """Keep background, header, slide title, footer, and page counter immediately visible."""
    t = sh.top / 914400.0
    l = sh.left / 914400.0
    w = sh.width / 914400.0
    h = sh.height / 914400.0
    if w > 12.8 and h > 7.0:
        return True  # Full-slide paper background
    if t < 1.76 and l < 13.0:
        return True  # Eyebrow, badge, title, slide ref
    if t >= 6.90:
        return True  # Bottom footer & slide number
    return False


def _cluster_click_groups(slide, slide_num: int):
    """Group non-chrome shapes into 2..5 logical click-reveal groups for paced teaching."""
    # Section dividers (S01, S07, S36, S58, S87, S93): gentle slide transition, keep clean immediate layout
    if slide_num in (1, 7, 36, 58, 87, 93, 95):
        return []
    # Video slides already have native media triggers - leave untouched
    if slide._element.find(f".//{P}timing") is not None:
        return []

    body_shapes = [sh for sh in slide.shapes if not _is_chrome(sh)]
    if len(body_shapes) <= 2:
        return [[sh.shape_id] for sh in body_shapes] if body_shapes else []

    # Dense vector schematic slides (e.g. breadboard dots): leave drawn schematic visible, animate text/photos
    if len(body_shapes) > 40:
        right_or_big = [
            sh for sh in body_shapes
            if (sh.shape_type == 13) or sh.has_text_frame or (sh.left / 914400.0 > 6.7 and sh.width / 914400.0 > 1.5)
        ]
        # Skip huge breadboard dots/lines with empty text
        anim_only = [sh for sh in right_or_big if (sh.shape_type == 13) or (sh.has_text_frame and sh.text_frame.text.strip())]
        if not anim_only:
            return []
        anim_only.sort(key=lambda x: (round(x.top / 914400.0, 1), round(x.left / 914400.0, 1)))
        return [[sh.shape_id] for sh in anim_only[:5]] if len(anim_only) <= 5 else [
            [sh.shape_id for sh in anim_only[: len(anim_only) // 2]],
            [sh.shape_id for sh in anim_only[len(anim_only) // 2 :]],
        ]

    # Identify card/panel containers (width >= 2.1 in and height >= 0.85 in with no or minimal text)
    containers = [
        sh for sh in body_shapes
        if not sh.has_text_frame or len(sh.text_frame.text.strip()) == 0
    ]
    containers = [
        sh for sh in containers
        if (sh.width / 914400.0) >= 2.1 and (sh.height / 914400.0) >= 0.85
    ]

    assigned = set()
    groups = []

    if len(containers) >= 2:
        # Sort containers reading order (top row L->R, bottom row L->R)
        containers.sort(key=lambda c: (round(c.top / 914400.0 * 0.6), round(c.left / 914400.0, 1)))
        for c in containers:
            cl, ct = c.left, c.top
            cr, cb = cl + c.width, ct + c.height
            grp = [c.shape_id]
            assigned.add(c.shape_id)
            for sh in body_shapes:
                if sh.shape_id in assigned:
                    continue
                mx = sh.left + sh.width // 2
                my = sh.top + sh.height // 2
                if (cl - 150000) <= mx <= (cr + 150000) and (ct - 150000) <= my <= (cb + 150000):
                    grp.append(sh.shape_id)
                    assigned.add(sh.shape_id)
            groups.append(grp)

    rem = [sh for sh in body_shapes if sh.shape_id not in assigned]
    if rem:
        # Activity / Vote / Reveal prompt at y=1.80..2.75 spans wide: keep top prompt visible at slide load!
        if not containers and len(rem) > 3:
            rem.sort(key=lambda x: (round(x.top / 914400.0, 1), round(x.left / 914400.0, 1)))
            if (rem[0].top / 914400.0) < 2.15 and (rem[0].width / 914400.0) > 8.0 and rem[0].has_text_frame:
                rem = rem[1:]  # Keep prompt question readable on entry; pace reveal options/answers below!
        # Group remaining shapes into up to 3 balanced visual bands/columns
        rem.sort(key=lambda x: (round(x.top / 914400.0 * 0.7), round(x.left / 914400.0 * 0.7)))
        if len(rem) <= 3:
            for sh in rem:
                groups.append([sh.shape_id])
        else:
            # Bucket into 2 or 3 chunks so presenter never clicks more than 5 times per slide
            k = 3 if len(groups) == 0 else min(2, max(1, 5 - len(groups)))
            chunk_sz = max(1, (len(rem) + k - 1) // k)
            for i in range(0, len(rem), chunk_sz):
                groups.append([sh.shape_id for sh in rem[i : i + chunk_sz]])

    # Cap total clicks on any slide at 5 by merging trailing small groups if needed
    while len(groups) > 5:
        tail = groups.pop()
        groups[-1].extend(tail)
    return [g for g in groups if g]


def _build_timing_xml(groups: list[list[int]]) -> etree._Element:
    """Build valid OOXML <p:timing> click-reveal Fade sequence + <p:bldLst>."""
    next_id = 1

    def nid():
        nonlocal next_id
        v = next_id
        next_id += 1
        return str(v)

    timing = etree.Element(f"{P}timing")
    tn_lst = etree.SubElement(timing, f"{P}tnLst")
    root_par = etree.SubElement(tn_lst, f"{P}par")
    root_ctn = etree.SubElement(root_par, f"{P}cTn", id=nid(), dur="indefinite", restart="never", nodeType="tmRoot")
    root_ch = etree.SubElement(root_ctn, f"{P}childTnLst")

    seq = etree.SubElement(root_ch, f"{P}seq", concurrent="1", nextAc="seek")
    seq_ctn = etree.SubElement(seq, f"{P}cTn", id=nid(), dur="indefinite", nodeType="mainSeq")
    seq_ch = etree.SubElement(seq_ctn, f"{P}childTnLst")

    for grp in groups:
        click_par = etree.SubElement(seq_ch, f"{P}par")
        click_ctn = etree.SubElement(click_par, f"{P}cTn", id=nid(), fill="hold")
        st = etree.SubElement(click_ctn, f"{P}stCondLst")
        etree.SubElement(st, f"{P}cond", delay="indefinite")
        click_ch = etree.SubElement(click_ctn, f"{P}childTnLst")

        step_par = etree.SubElement(click_ch, f"{P}par")
        step_ctn = etree.SubElement(step_par, f"{P}cTn", id=nid(), fill="hold")
        step_st = etree.SubElement(step_ctn, f"{P}stCondLst")
        etree.SubElement(step_st, f"{P}cond", delay="0")
        step_ch = etree.SubElement(step_ctn, f"{P}childTnLst")

        for idx, sp_id in enumerate(grp):
            eff_par = etree.SubElement(step_ch, f"{P}par")
            eff_ctn = etree.SubElement(
                eff_par,
                f"{P}cTn",
                id=nid(),
                presetID="10",
                presetClass="entr",
                presetSubtype="0",
                fill="hold",
                grpId=str(idx),
                nodeType=("clickEffect" if idx == 0 else "withEffect"),
            )
            e_st = etree.SubElement(eff_ctn, f"{P}stCondLst")
            etree.SubElement(e_st, f"{P}cond", delay="0")
            e_ch = etree.SubElement(eff_ctn, f"{P}childTnLst")

            set_el = etree.SubElement(e_ch, f"{P}set")
            set_cbh = etree.SubElement(set_el, f"{P}cBhvr")
            etree.SubElement(set_cbh, f"{P}cTn", id=nid(), dur="1", fill="hold")
            set_tgt = etree.SubElement(set_cbh, f"{P}tgtEl")
            etree.SubElement(set_tgt, f"{P}spTgt", spid=str(sp_id))
            set_attr = etree.SubElement(set_cbh, f"{P}attrNameLst")
            etree.SubElement(set_attr, f"{P}attrName").text = "style.visibility"
            to = etree.SubElement(set_el, f"{P}to")
            etree.SubElement(to, f"{P}strVal", val="visible")

            anim_el = etree.SubElement(e_ch, f"{P}animEffect", transition="in", filter="fade")
            a_cbh = etree.SubElement(anim_el, f"{P}cBhvr")
            etree.SubElement(a_cbh, f"{P}cTn", id=nid(), dur="320")
            a_tgt = etree.SubElement(a_cbh, f"{P}tgtEl")
            etree.SubElement(a_tgt, f"{P}spTgt", spid=str(sp_id))

    prev_c = etree.SubElement(seq, f"{P}prevCondLst")
    pc = etree.SubElement(prev_c, f"{P}cond", evt="onPrev", delay="0")
    etree.SubElement(pc, f"{P}tgtEl")
    etree.SubElement(pc.find(f"{P}tgtEl"), f"{P}sldTgt")

    next_c = etree.SubElement(seq, f"{P}nextCondLst")
    nc = etree.SubElement(next_c, f"{P}cond", evt="onNext", delay="0")
    etree.SubElement(nc, f"{P}tgtEl")
    etree.SubElement(nc.find(f"{P}tgtEl"), f"{P}sldTgt")

    bld_lst = etree.SubElement(timing, f"{P}bldLst")
    for gi, grp in enumerate(groups):
        for sp_id in grp:
            etree.SubElement(bld_lst, f"{P}bldP", spid=str(sp_id), grpId=str(gi))

    return timing


def apply_animations_and_transitions(prs):
    anim_slides = 0
    total_clicks = 0
    for idx, slide in enumerate(prs.slides, 1):
        if idx in (1, 7, 36, 58, 87, 93):
            add_fade_transition(slide)
        groups = _cluster_click_groups(slide, idx)
        if groups:
            sld = slide._element
            timing = _build_timing_xml(groups)
            # Place strictly after clrMapOvr / transition (at end of p:sld element)
            sld.append(timing)
            anim_slides += 1
            total_clicks += len(groups)
    return anim_slides, total_clicks


def verify_added_photo_no_overlap(prs, added_by_slide):
    """Fail immediately if an inserted photo accidentally sits on top of unrelated text/table shapes."""
    overlaps = []
    for snum, added_shapes in added_by_slide.items():
        sl = prs.slides[snum - 1]
        added_ids = {sh.shape_id for sh in added_shapes}
        for psh in added_shapes:
            if psh.shape_type != 13:
                continue
            pl, pt, pr, pb = psh.left, psh.top, psh.left + psh.width, psh.top + psh.height
            for osh in sl.shapes:
                if osh.shape_id in added_ids:
                    continue
                if not (osh.has_text_frame and osh.text_frame.text.strip()) and osh.shape_type != 19:
                    continue
                ol, ot, orr, ob = osh.left, osh.top, osh.left + osh.width, osh.top + osh.height
                iw = min(pr, orr) - max(pl, ol)
                ih = min(pb, ob) - max(pt, ot)
                if iw > 45000 and ih > 45000:  # > 0.05 in intersection
                    overlaps.append((snum, round(iw / 914400, 2), round(ih / 914400, 2), osh.name))
    assert not overlaps, f"Photo overlap detected: {overlaps}"


def main():
    prs = Presentation(str(SRC_PPT))
    added = apply_real_photos_and_cleanups(prs)
    verify_added_photo_no_overlap(prs, added)
    anim_slides, total_clicks = apply_animations_and_transitions(prs)
    prs.save(str(DST_PPT))
    pics_total = sum(1 for sl in prs.slides for sh in sl.shapes if sh.shape_type == 13)
    print(f"Saved {DST_PPT.name} ({len(prs.slides)} slides)")
    print(f"Pictures across deck: {pics_total} total")
    print(f"Animated slides: {anim_slides} (+3 existing video slides) | Total paced clicks: {total_clicks}")


if __name__ == "__main__":
    main()
