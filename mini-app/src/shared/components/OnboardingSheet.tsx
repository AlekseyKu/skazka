import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import BottomSheet from "./BottomSheet";
import Button from "./Button";
import { useOnboardingStore } from "../stores/onboardingStore";
import { useChildrenProfilesStore } from "../stores/childrenProfilesStore";

const AGE_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10];

const INTEREST_OPTIONS = [
  "🐰 Животные",
  "🏰 Приключения",
  "🤝 Дружба",
  "✨ Волшебство",
  "🌳 Природа",
  "😴 Засыпание",
  "⚔️ Герои",
];

export default function OnboardingSheet() {
  const location = useLocation();
  const { completed, childName, childAge, interests, complete } =
    useOnboardingStore();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(childName);
  const [age, setAge] = useState<number>(childAge);
  const [selectedInterests, setSelectedInterests] =
    useState<string[]>(interests);

  useEffect(() => {
    if (!completed && location.pathname === "/") {
      setName(childName);
      setAge(childAge);
      setSelectedInterests(interests);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [completed, location.pathname, childName, childAge, interests]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleSave = () => {
    const trimmedName = name.trim() || "Маша";
    complete({
      childName: trimmedName,
      childAge: age,
      interests: selectedInterests,
    });
    const children = useChildrenProfilesStore.getState().children;
    if (children.length > 0) {
      useChildrenProfilesStore.getState().updateChild(children[0].id, {
        name: trimmedName,
        age,
        interests: selectedInterests,
      });
    }
    setOpen(false);
  };

  if (completed && !open) return null;

  const canSave = name.trim().length > 0 && !!age;

  return (
    <BottomSheet
      open={open}
      onClose={() => setOpen(false)}
      title="Давай познакомимся"
      footer={
        <Button
          style={{ width: "100%" }}
          disabled={!canSave}
          onClick={handleSave}
        >
          Сохранить
        </Button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <p style={{ marginBottom: 4 }}>Как зовут ребёнка?</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Маша"
            style={{
              width: "100%",
              borderRadius: 14,
              padding: "10px 12px",
              border: "1px solid rgba(255,255,255,0.24)",
              background: "rgba(10,9,29,0.8)",
              color: "#fff",
            }}
          />
        </div>

        <div>
          <p style={{ marginBottom: 4 }}>Сколько ему лет?</p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {AGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAge(option)}
                style={{
                  minWidth: 32,
                  padding: "4px 8px",
                  borderRadius: 999,
                  fontSize: 13,
                  border:
                    age === option
                      ? "1px solid var(--accent-warm)"
                      : "1px solid rgba(255,255,255,0.18)",
                  background:
                    age === option
                      ? "rgba(240,160,60,0.2)"
                      : "rgba(255,255,255,0.06)",
                  color: "#fff",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p style={{ marginBottom: 4 }}>Что ему больше всего нравится?</p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {INTEREST_OPTIONS.map((option) => {
              const active = selectedInterests.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleInterest(option)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 14,
                    fontSize: 13,
                    border:
                      active
                        ? "1px solid var(--accent-warm)"
                        : "1px solid rgba(255,255,255,0.18)",
                    background: active
                      ? "rgba(240,160,60,0.2)"
                      : "rgba(255,255,255,0.06)",
                    color: "#fff",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}

