import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import {
  fetchSurveyQuestions,
  completeOnboarding,
} from "@/services/onboardingservices";
import type { SurveyData } from "@/services/onboardingservices";
import { useAuth } from "@/contexts/useAuth";

// Định nghĩa type cho SurveyQuestion
interface SurveyQuestion {
  key: string;
  label: string;
  type: "radio" | "checkbox" | "text";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<SurveyData & { [key: string]: any }>(
    {
      age: "",
      gender: "",
      hobbies: [],
      isActive: "",
      likesReading: "",
      partyAnimal: "",
      horoscope: "",
    }
  );
  const [readingNow, setReadingNow] = useState("no");
  const navigate = useNavigate();
  const { success } = useToast();
  const { setUser } = useAuth();

  useEffect(() => {
    fetchSurveyQuestions().then((data) => {
      setQuestions([
        ...data
      ]);
    });
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormData((prev: typeof formData) => ({ ...prev, [key]: value }));
    if (key === "readingNow") setReadingNow(value);
  };

  const handleCheckboxChange = (
    key: string,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: checked
        ? [...(Array.isArray(prev[key]) ? prev[key] : []), value]
        : (Array.isArray(prev[key]) ? prev[key] : []).filter(
            (v: string) => v !== value
          ),
    }));
  };

  const handleNext = () => {
    if (step < Math.ceil(questions.length / 2)) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    await completeOnboarding(formData as SurveyData);
    // Sau khi hoàn thành onboarding, gọi lại getCurrentUser để lấy trạng thái mới
    const userData = await import("@/services/authservices").then((m) =>
      m.getCurrentUser()
    );
    setUser?.(userData); // cập nhật context user nếu có
    if (userData.hasCompletedSurvey !== undefined) {
      localStorage.setItem(
        "hasCompletedSurvey",
        String(userData.hasCompletedSurvey)
      );
    }
    success("Your preferences have been saved successfully!");
    navigate("/dashboard");
  };

  // Render form động dựa trên questions
  const renderStep = () => {
    if (questions.length === 0) return null;
    // Hiển thị 2 câu hỏi mỗi bước
    const start = (step - 1) * 2;
    const end = start + 2;
    const stepQuestions = questions.slice(start, end);
    return (
      <div className="space-y-6">
        {stepQuestions.map((q) => {
          if (q.key === "bookName" && readingNow !== "Có") return null;
          if (q.type === "radio") {
            return (
              <div key={q.key}>
                <Label className="text-base font-medium">{q.label}</Label>
                <RadioGroup
                  key={q.key}
                  name={q.key}
                  value={
                    typeof formData[q.key] === "string" ? formData[q.key] : ""
                  }
                  onValueChange={(value) => handleChange(q.key, value)}
                >
                  {q.options &&
                    q.options.map((opt: string) => (
                      <div
                        key={`${q.key}-${encodeURIComponent(opt)}`}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={opt}
                          id={`${q.key}-${encodeURIComponent(opt)}`}
                        />
                        <Label htmlFor={`${q.key}-${encodeURIComponent(opt)}`}>
                          {opt}
                        </Label>
                      </div>
                    ))}
                </RadioGroup>
              </div>
            );
          }
          if (q.type === "checkbox") {
            return (
              <div key={q.key}>
                <Label className="text-base font-medium">{q.label}</Label>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {q.options &&
                    q.options.map((opt: string) => (
                      <div
                        key={`${q.key}-${encodeURIComponent(opt)}`}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${q.key}-${encodeURIComponent(opt)}`}
                          checked={
                            Array.isArray(formData[q.key]) &&
                            formData[q.key].includes(opt)
                          }
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(q.key, opt, !!checked)
                          }
                        />
                        <Label htmlFor={`${q.key}-${encodeURIComponent(opt)}`}>
                          {opt}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            );
          }
          if (q.type === "text") {
            return (
              <div key={q.key}>
                <Label className="text-base font-medium">{q.label}</Label>
                <input
                  type="text"
                  className="border rounded px-2 py-1 ml-2"
                  placeholder={q.placeholder || ""}
                  value={formData[q.key] || ""}
                  onChange={(e) => handleChange(q.key, e.target.value)}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-white to-emerald-500 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="animate-fade-in bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle >
              Let's personalize your TimeWisely experience
            </CardTitle>
            <CardDescription>
              Help us understand your preferences so we can suggest the perfect
              activities for you.
            </CardDescription>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {Array.from(
                  { length: Math.ceil(questions.length / 2) },
                  (_, i) => i + 1
                ).map((stepNumber) => (
                  <div
                    key={"step-" + stepNumber}
                    className={`w-3 h-3 rounded-full ${
                      stepNumber <= step
                        ? "bg-[var(--wisely-purple)]"
                        : "bg-gray-300 dark:bg-amber-900"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="border-gray-300 text-[var(--wisely-gray)] hover:bg-gray-50"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-[var(--wisely-purple)] hover:bg-purple-600 text-white"
              >
                {step === Math.ceil(questions.length / 2) ? "Finish" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
