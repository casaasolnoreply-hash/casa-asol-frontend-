import { useState, useRef, useEffect } from "react";
import { PRIMARY } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { HuipilStripeVertical, NahualesStripeVertical } from "../ui/GuatemalanMotifs";

const THUMB_MIN = 34;

export default function ExpandModal() {
  const { expandModal, setExpandModal } = useApp();
  const scrollRef = useRef(null);
  const innerRef = useRef(null);
  const dragRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [thumb, setThumb] = useState({ height: 0, top: 0 });

  const computeThumb = () => {
    const el = scrollRef.current;
    if (!el) return;
    const trackHeight = el.clientHeight;
    const scrollableDist = el.scrollHeight - el.clientHeight;
    const height = Math.min(trackHeight, Math.max((trackHeight / el.scrollHeight) * trackHeight, THUMB_MIN));
    const maxTop = trackHeight - height;
    const top = scrollableDist > 0 ? (el.scrollTop / scrollableDist) * maxTop : 0;
    setThumb({ height, top });
  };

  useEffect(() => {
    if (!expandModal) return;
    const scrollEl = scrollRef.current;
    const innerEl = innerRef.current;
    if (!scrollEl || !innerEl) return;
    scrollEl.scrollTop = 0;

    const check = () => {
      setNeedsScroll(scrollEl.scrollHeight > scrollEl.clientHeight + 4);
      setAtBottom(scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight < 4);
      computeThumb();
    };
    check();

    const ro = new ResizeObserver(check);
    ro.observe(innerEl);
    return () => ro.disconnect();
  }, [expandModal]);

  if (!expandModal) return null;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 4);
    computeThumb();
  };

  const stopDrag = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", stopDrag);
  };

  const onDragMove = (e) => {
    const el = scrollRef.current;
    const d = dragRef.current;
    if (!el || !d || d.maxTop <= 0) return;
    const deltaY = e.clientY - d.startY;
    const deltaScroll = (deltaY / d.maxTop) * d.scrollableDist;
    el.scrollTop = Math.min(Math.max(d.startScrollTop + deltaScroll, 0), d.scrollableDist);
  };

  const onThumbPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = scrollRef.current;
    if (!el) return;
    dragRef.current = {
      startY: e.clientY,
      startScrollTop: el.scrollTop,
      maxTop: el.clientHeight - thumb.height,
      scrollableDist: el.scrollHeight - el.clientHeight,
    };
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", stopDrag);
  };

  const onTrackClick = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    const trackRect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const maxTop = trackRect.height - thumb.height;
    const scrollableDist = el.scrollHeight - el.clientHeight;
    if (maxTop <= 0) return;
    const ratio = Math.min(Math.max((clickY - thumb.height / 2) / maxTop, 0), 1);
    el.scrollTop = ratio * scrollableDist;
  };

  return (
    <div
      onClick={() => setExpandModal(null)}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.72)",
        zIndex: 3000, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 14,
          maxWidth: 820, width: "100%", maxHeight: "90vh",
          boxShadow: "0 32px 96px rgba(0,0,0,.45)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 16, zIndex: 2 }}>
          <HuipilStripeVertical width={16} />
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 20, zIndex: 2 }}>
          <NahualesStripeVertical width={20} />
        </div>

        <button
          onClick={() => setExpandModal(null)}
          style={{ position: "absolute", top: 16, right: 32, zIndex: 3, background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "#aaa", lineHeight: 1 }}
        >
          ×
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="ca-modal-scroll"
          style={{ padding: "44px 50px 44px 40px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" }}
        >
          <div ref={innerRef}>
            <h2 style={{ margin: "0 0 28px", fontSize: 30, fontWeight: 800, color: PRIMARY }}>
              {expandModal.title}
            </h2>
            <div style={{ fontSize: 17, lineHeight: 1.85, color: "#333" }}>
              {expandModal.content}
            </div>
          </div>
        </div>

        {needsScroll && (
          <div
            onClick={onTrackClick}
            style={{
              position: "absolute", top: 64, bottom: 16, right: 27, width: 14, zIndex: 4,
              display: "flex", justifyContent: "center", cursor: "pointer", touchAction: "none",
            }}
          >
            <div style={{ position: "relative", width: 6, height: "100%", borderRadius: 999, background: "rgba(15,64,140,.1)" }}>
              <div
                onPointerDown={onThumbPointerDown}
                style={{
                  position: "absolute", left: 0, width: 6, borderRadius: 999,
                  height: thumb.height, top: thumb.top,
                  background: PRIMARY, opacity: .8,
                  cursor: "grab", touchAction: "none",
                }}
              />
            </div>
          </div>
        )}

        {needsScroll && !atBottom && (
          <div style={{
            position: "absolute", left: 16, right: 20, bottom: 0, height: 44, zIndex: 2, pointerEvents: "none",
            background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.96) 75%)",
            transition: "opacity .25s",
          }} />
        )}
      </div>

      <style>{`
        .ca-modal-scroll::-webkit-scrollbar { width: 0; height: 0; }
        .ca-modal-scroll { scrollbar-width: none; }
      `}</style>
    </div>
  );
}
