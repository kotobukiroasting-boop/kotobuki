import { useState, useMemo } from "react";

const BEANS = {
  浅煎り: [
    "WUSH WUSH カッファG1 ウォッシュド",
    "エチオピア アナソラ アナエロビック",
    "モカ・ヘレフG１「ナチュラル精製」",
    "コロンビア ゲイシャ サーマルショック",
    "コロンビア アプリコットパンチ",
    "COLOMBIA Uba NITRO-WASH",
    "エルディビソ サーマルショック",
    "ラス・アギラス SIDRA WASHED",
    "コロンビア ジューシーグレープ",
    "アカシアヒルズ パカマラ",
    "シナモン ラ・ピラグア コロンビア",
    "コロンビア ゲイシャ ピーチ",
    "日本初登場 ワイニーフラワー",
    "ペルラ・デ・オトゥン SUDAN RUMME",
    "コロンビア スイートベリー",
    "ブラジル ゲイシャ カーボニックマセレーション",
    "Brazil コヘゴ・ダ・リベルダージ COE2023 第5位",
    "オーロヴェルデ ナチュラル COE2022 第3位",
    "ルワンダ ニャマシェケ レッドブルボン",
    "パナマ グラン・デル・バル",
    "ウガンダ ニャビロンゴ アナエロビック",
    "雲南 レモン＆ベルガモット アナエロビックハニー",
    "グアテマラ COE2024 ロス・コネホス #5",
    "ゲイシャ ナチュラル エドウィンファンカ ボリビア",
    "グアテマラ ウエウエテナンゴ",
    "寿ブレンド＿華",
    "寿ブレンド＿姫",
    "モカ・ヘレフG１「ウォッシュド精製」",
  ],
  中煎り: [
    "ブラジル セーハ・ド・ボネ",
    "ブラジル カルモエステート",
    "ハワイ コナ",
    "ブルーマウンテン",
    "稀少天然 コピルアク ジャコウネコ",
    "デイリーブレンド",
    "フォレストマウンテン",
  ],
  深煎り: [
    "ブラジル ロブスタ コニロン",
    "タイ OMKOI オムコイ オーガニック",
    "日本初輸入 ラヒャン インドネシア",
    "ペルー マチュピチュ",
    "タンザニア ンゴロンゴロ",
    "インド ファインロブスタ パパクチ",
    "インドネシア マンデリン",
    "グアテマラ アンティグア",
    "ケニア ニエリ ファクトリー ウォッシュド",
    "寿ブレンド＿殿",
    "アイスブレンド",
    "水出しコーヒー「コールドブリュー」２ℓ対応",
    "フルッタメルカドン デカフェ",
    "ドン・ラファ デカフェ",
    "モカ・ヘレフG１「ウォッシュド精製」",
  ],
};

const ROAST_COLORS = {
  浅煎り: { bg: "#FFF8F0", accent: "#E8956D", badge: "#F2C49B", text: "#7A3B1E" },
  中煎り: { bg: "#FFF4E8", accent: "#C0732A", badge: "#D4956A", text: "#5C3010" },
  深煎り: { bg: "#F5EDE4", accent: "#6B3416", badge: "#8B5E3C", text: "#2E1505" },
};

const BAG_SIZES = ["大", "中", "小"];
const LOCATIONS = ["1F手前", "1F奥", "2F"];

function getRoastForBean(beanName) {
  for (const [roast, beans] of Object.entries(BEANS)) {
    if (beans.includes(beanName)) return roast;
  }
  return null;
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(20,10,5,0.55)",
        zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#FFFAF5", borderRadius: 16, padding: "32px 28px",
          maxWidth: 480, width: "90%", boxShadow: "0 8px 48px rgba(100,40,0,0.18)",
          border: "1.5px solid #E8D5C0",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function CoffeeInventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ roast: "浅煎り", bean: "", bagSize: "中", location: "1F手前" });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterRoast, setFilterRoast] = useState("全て");
  const [filterLocation, setFilterLocation] = useState("全て");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const allBeans = useMemo(() => {
    return BEANS[form.roast] || [];
  }, [form.roast]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchRoast = filterRoast === "全て" || item.roast === filterRoast;
      const matchLoc = filterLocation === "全て" || item.location === filterLocation;
      const matchSearch = item.bean.includes(search);
      return matchRoast && matchLoc && matchSearch;
    });
  }, [items, filterRoast, filterLocation, search]);

  function openAdd() {
    setForm({ roast: "浅煎り", bean: BEANS["浅煎り"][0], bagSize: "中", location: "1F手前" });
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(item) {
    setForm({ roast: item.roast, bean: item.bean, bagSize: item.bagSize, location: item.location });
    setEditId(item.id);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.bean) return;
    if (editId !== null) {
      setItems(prev => prev.map(i => i.id === editId ? { ...i, ...form } : i));
    } else {
      setItems(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  }

  function handleDelete(id) {
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteConfirm(null);
  }

  const bagIcon = { 大: "◉", 中: "◎", 小: "○" };
  const locIcon = { "1F手前": "①", "1F奥": "②", "2F": "③" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FFF7EE 0%, #F5E9D8 60%, #EDD9BF 100%)",
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
      color: "#2E1505",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #3B1A08 0%, #6B3416 100%)",
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(40,10,0,0.25)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>☕</span>
          <div>
            <div style={{ color: "#FFE0BA", fontSize: 20, fontWeight: 700, letterSpacing: "0.08em" }}>
              コーヒー豆 在庫管理
            </div>
            <div style={{ color: "#C4946A", fontSize: 12, letterSpacing: "0.12em" }}>
              COFFEE BEAN INVENTORY
            </div>
          </div>
        </div>
        <button
          onClick={openAdd}
          style={{
            background: "linear-gradient(135deg, #E8956D, #C0732A)",
            color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 22px", fontSize: 14, fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.06em",
            boxShadow: "0 2px 12px rgba(200,80,0,0.3)",
            transition: "transform 0.1s",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          ＋ 在庫を追加
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, padding: "20px 32px 0" }}>
        {["全て", "浅煎り", "中煎り", "深煎り"].map(r => {
          const count = r === "全て" ? items.length : items.filter(i => i.roast === r).length;
          const c = r === "全て" ? { accent: "#8B5E3C", badge: "#D4956A" } : ROAST_COLORS[r];
          return (
            <div key={r} style={{
              background: "#fff",
              borderRadius: 12, padding: "12px 20px",
              border: `2px solid ${c.badge}`,
              flex: 1, textAlign: "center",
              boxShadow: "0 2px 8px rgba(100,40,0,0.07)",
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.accent }}>{count}</div>
              <div style={{ fontSize: 11, color: "#8B6A50", letterSpacing: "0.08em" }}>{r}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{
        display: "flex", gap: 12, padding: "16px 32px",
        flexWrap: "wrap", alignItems: "center",
      }}>
        <input
          placeholder="🔍 豆の名前で検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 180, padding: "9px 14px", borderRadius: 9,
            border: "1.5px solid #D4B896", fontSize: 13, background: "#FFFAF5",
            color: "#3B1A08", outline: "none",
          }}
        />
        <select value={filterRoast} onChange={e => setFilterRoast(e.target.value)}
          style={selectStyle}>
          <option>全て</option>
          <option>浅煎り</option>
          <option>中煎り</option>
          <option>深煎り</option>
        </select>
        <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}
          style={selectStyle}>
          <option>全て</option>
          {LOCATIONS.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ padding: "0 32px 40px" }}>
        {filteredItems.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "#C4946A", fontSize: 15,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🫘</div>
            {items.length === 0 ? "在庫がまだ登録されていません" : "条件に一致する在庫がありません"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredItems.map(item => {
              const c = ROAST_COLORS[item.roast];
              return (
                <div key={item.id} style={{
                  background: "#FFFAF5",
                  borderRadius: 12, border: `1.5px solid ${c.badge}`,
                  padding: "14px 20px",
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: "0 2px 8px rgba(100,40,0,0.06)",
                  transition: "box-shadow 0.2s",
                }}>
                  {/* Roast badge */}
                  <span style={{
                    background: c.badge, color: c.text,
                    borderRadius: 8, padding: "3px 10px",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}>{item.roast}</span>

                  {/* Bean name */}
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#2E1505" }}>
                    {item.bean}
                  </span>

                  {/* Bag size */}
                  <span style={{
                    fontSize: 13, color: c.accent, fontWeight: 700,
                    background: c.bg, borderRadius: 7, padding: "3px 10px",
                    border: `1px solid ${c.badge}`,
                  }}>
                    {bagIcon[item.bagSize]} {item.bagSize}
                  </span>

                  {/* Location */}
                  <span style={{
                    fontSize: 13, color: "#5C3010", fontWeight: 600,
                    background: "#F0E4D4", borderRadius: 7, padding: "3px 10px",
                    border: "1px solid #D4B896",
                  }}>
                    {locIcon[item.location]} {item.location}
                  </span>

                  {/* Actions */}
                  <button onClick={() => openEdit(item)} style={iconBtn("#E8956D")}>✏️</button>
                  <button onClick={() => setDeleteConfirm(item.id)} style={iconBtn("#C0732A")}>🗑️</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#3B1A08", marginBottom: 4 }}>
            {editId ? "在庫を編集" : "在庫を追加"}
          </div>
          <div style={{ height: 2, background: "linear-gradient(90deg,#E8956D,#C0732A)", borderRadius: 2 }} />
        </div>

        <label style={labelStyle}>焙煎度</label>
        <select value={form.roast} onChange={e => setForm(f => ({ ...f, roast: e.target.value, bean: BEANS[e.target.value][0] }))}
          style={{ ...selectStyle, width: "100%", marginBottom: 14 }}>
          <option>浅煎り</option>
          <option>中煎り</option>
          <option>深煎り</option>
        </select>

        <label style={labelStyle}>豆の名前</label>
        <select value={form.bean} onChange={e => setForm(f => ({ ...f, bean: e.target.value }))}
          style={{ ...selectStyle, width: "100%", marginBottom: 14 }}>
          {allBeans.map(b => <option key={b}>{b}</option>)}
        </select>

        <label style={labelStyle}>袋のサイズ</label>
        <select value={form.bagSize} onChange={e => setForm(f => ({ ...f, bagSize: e.target.value }))}
          style={{ ...selectStyle, width: "100%", marginBottom: 14 }}>
          {BAG_SIZES.map(s => <option key={s}>{s}</option>)}
        </select>

        <label style={labelStyle}>場所</label>
        <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
          style={{ ...selectStyle, width: "100%", marginBottom: 24 }}>
          {LOCATIONS.map(l => <option key={l}>{l}</option>)}
        </select>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowModal(false)} style={{
            flex: 1, padding: "11px 0", borderRadius: 9, border: "1.5px solid #D4B896",
            background: "#FFFAF5", color: "#8B6A50", fontWeight: 600, cursor: "pointer", fontSize: 14,
          }}>キャンセル</button>
          <button onClick={handleSave} style={{
            flex: 2, padding: "11px 0", borderRadius: 9, border: "none",
            background: "linear-gradient(135deg,#E8956D,#C0732A)",
            color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14,
            boxShadow: "0 2px 10px rgba(180,80,0,0.25)",
          }}>
            {editId ? "更新する" : "追加する"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#3B1A08" }}>
            この在庫を削除しますか？
          </div>
          <div style={{ fontSize: 13, color: "#8B6A50", marginBottom: 24 }}>
            削除すると元に戻せません。
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setDeleteConfirm(null)} style={{
              flex: 1, padding: "11px 0", borderRadius: 9, border: "1.5px solid #D4B896",
              background: "#FFFAF5", color: "#8B6A50", fontWeight: 600, cursor: "pointer",
            }}>キャンセル</button>
            <button onClick={() => handleDelete(deleteConfirm)} style={{
              flex: 1, padding: "11px 0", borderRadius: 9, border: "none",
              background: "linear-gradient(135deg,#C0732A,#8B3A10)",
              color: "#fff", fontWeight: 700, cursor: "pointer",
            }}>削除する</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const selectStyle = {
  padding: "9px 12px", borderRadius: 9,
  border: "1.5px solid #D4B896", fontSize: 13,
  background: "#FFFAF5", color: "#3B1A08",
  outline: "none", cursor: "pointer",
};

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 700,
  color: "#8B5E3C", letterSpacing: "0.08em", marginBottom: 5,
};

function iconBtn(color) {
  return {
    background: "transparent", border: "none",
    cursor: "pointer", fontSize: 16, padding: "4px 6px",
    borderRadius: 7, transition: "background 0.15s",
  };
}
