import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ChatSettings as ChatSettingsType,
  ModelName,
} from "../_utils/types";
import { MODEL_LABELS } from "../_utils/types";
import { PromptTemplates } from "./PromptTemplates";

type ChatSettingsProps = {
  settings: ChatSettingsType;
  onChange: (settings: ChatSettingsType) => void;
  modelLocked?: boolean;
};

const MODEL_OPTIONS: { value: ModelName; label: string }[] = (
  Object.entries(MODEL_LABELS) as [ModelName, string][]
).map(([value, label]) => ({ value, label }));

export function ChatSettings({
  settings,
  onChange,
  modelLocked,
}: ChatSettingsProps) {
  return (
    <div className='flex h-full flex-col gap-6 overflow-y-auto p-5'>
      <div>
        <h2 className='font-fraunces text-sm font-semibold text-[var(--foreground)]'>
          Settings
        </h2>
        <p className='mt-1 text-xs text-[var(--text-secondary)]'>
          Controls apply to your next message.
        </p>
      </div>

      {/* Model selector */}
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='model-select'>Model</Label>
        <Select
          value={settings.modelName}
          onValueChange={(value) =>
            onChange({ ...settings, modelName: value as ModelName })
          }
          disabled={modelLocked}
        >
          <SelectTrigger id='model-select' className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODEL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {modelLocked && (
          <p className='text-[11px] text-[var(--text-secondary)]'>
            Model is locked while a response is streaming.
          </p>
        )}
      </div>

      {/* Temperature slider */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <Label>Temperature</Label>
          <span className='rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent-dim)]'>
            {settings.temperature.toFixed(1)}
          </span>
        </div>
        <Slider
          min={0}
          max={2}
          step={0.1}
          value={[settings.temperature]}
          onValueChange={(values) =>
            onChange({ ...settings, temperature: (values as number[])[0] })
          }
        />
        <div className='flex justify-between text-[10px] text-[var(--text-secondary)]'>
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </div>

      {/* System prompt */}
      <div className='flex flex-1 flex-col'>
        <PromptTemplates
          systemPrompt={settings.systemPrompt}
          onSystemPromptChange={(value) =>
            onChange({ ...settings, systemPrompt: value })
          }
        />
      </div>
    </div>
  );
}
