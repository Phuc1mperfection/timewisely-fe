import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionButton } from "./OptionButton";
import {
  SwipeCardStack,
  type SwipeCardData,
} from "@/components/onboarding/SwipeCard";
import type { SurveyQuestion } from "@/services/onboardingservices";

interface SingleQuestionProps {
  question: SurveyQuestion;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onAutoAdvance?: () => void;
}

export const SingleQuestion = ({
  question,
  value,
  onChange,
  onAutoAdvance,
}: SingleQuestionProps) => {
  const handleRadioSelect = (option: string) => {
    onChange(option);
    // Auto-advance for radio questions after a short delay
    if (onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 300);
    }
  };

  const handleCheckboxToggle = (option: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(option)) {
      onChange(currentValues.filter((v) => v !== option));
    } else {
      onChange([...currentValues, option]);
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "radio":
        return (
          <div className="space-y-3">
            {question.options?.map((option: string) => (
              <OptionButton
                key={option}
                selected={value === option}
                onClick={() => handleRadioSelect(option)}
              >
                {option}
              </OptionButton>
            ))}
          </div>
        );

      case "checkbox": {
        const currentValues = Array.isArray(value) ? value : [];
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options?.map((option: string) => (
              <OptionButton
                key={option}
                selected={currentValues.includes(option)}
                onClick={() => handleCheckboxToggle(option)}
              >
                {option}
              </OptionButton>
            ))}
          </div>
        );
      }

      case "text":
        return (
          <Input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || ""}
            className="mt-4 p-4 text-base"
          />
        );

      case "swipe-cards": {
        // Convert cards data to SwipeCardData format
        const cards: SwipeCardData[] =
          question.cards?.map((card) => ({
            id: card.id,
            title: card.title,
            emoji: card.emoji,
            category: card.category,
            description: card.description,
            image: card.image,
          })) || [];

        return (
          <div className="mt-6">
            <SwipeCardStack
              cards={cards}
              onSwipe={(direction, cardId) => {
                console.log(`Swiped ${direction} on ${cardId}`);
              }}
              onComplete={(likedCards) => {
                onChange(likedCards);
                // Auto-advance after completing swipe cards
                if (onAutoAdvance) {
                  setTimeout(() => {
                    onAutoAdvance();
                  }, 500);
                }
              }}
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Label className="text-xl font-semibold text-foreground block">
          {question.label}
        </Label>
        {question.required && (
          <span className="text-sm text-muted-foreground">Required</span>
        )}
        {question.type === "checkbox" && (
          <span className="text-sm text-muted-foreground">
            Select all that apply
          </span>
        )}
      </div>
      {renderQuestion()}
    </div>
  );
};
