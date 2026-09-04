"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Loader2,
  Plus,
  Send,
  X,
} from "lucide-react";

import Link from "next/link";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import { createOpportunity } from "@/lib/firestoreOpportunities";

const types = [
  "Internship",
  "Full-time",
  "Part-time",
] as const;

const modes = [
  "Remote",
  "Hybrid",
  "On-site",
] as const;

export default function NewOpportunityPage() {
  return (
    <ProtectedRoute allowedRoles={["industry"]}>
      <Form />
    </ProtectedRoute>
  );
}

function Form() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<
    "Internship" | "Full-time" | "Part-time"
  >("Internship");
  const [mode, setMode] = useState<
    "Remote" | "Hybrid" | "On-site"
  >("Hybrid");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [stipend, setStipend] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");

  const [required, setRequired] = useState<string[]>([]);
  const [preferred, setPreferred] = useState<string[]>([]);

  const [requiredInput, setRequiredInput] =
    useState("");
  const [preferredInput, setPreferredInput] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addSkill(
    value: string,
    list: string[],
    setList: (items: string[]) => void
  ) {
    const trimmed = value.trim();

    if (!trimmed || list.includes(trimmed)) {
      return;
    }

    setList([...list, trimmed]);
  }

  function removeSkill(
    index: number,
    list: string[],
    setList: (items: string[]) => void
  ) {
    setList(list.filter((_, i) => i !== index));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!user) {
      return;
    }

    if (!title.trim() || !company.trim()) {
      setError("Title and company are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createOpportunity({
        title: title.trim(),
        company: company.trim(),
        companyId: user.uid,
        location: location.trim(),
        type,
        mode,
        description: description.trim(),
        requiredSkills: required,
        preferredSkills: preferred,
        experience: experience.trim() || undefined,
        stipend: stipend.trim() || undefined,
        salary: salary.trim() || undefined,
        deadline: deadline || undefined,
      });

      router.push("/industry/opportunities");
    } catch (err) {
      console.error(err);
      setError("Failed to create opportunity.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
          <Link
            href="/industry/opportunities"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="font-black">
              New Opportunity
            </h1>

            <p className="text-xs text-slate-500">
              Post a new role or internship
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-8 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Basic Details
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company
                </label>

                <input
                  value={company}
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                  placeholder="Company name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="e.g. Remote, Mumbai"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Type
                </label>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(
                      e.target.value as
                        | "Internship"
                        | "Full-time"
                        | "Part-time"
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  {types.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mode
                </label>

                <select
                  value={mode}
                  onChange={(e) =>
                    setMode(
                      e.target.value as
                        | "Remote"
                        | "Hybrid"
                        | "On-site"
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  {modes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Details
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe the role, responsibilities and expectations..."
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Experience
                </label>

                <input
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                  placeholder="e.g. 0-2 years"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Stipend
                </label>

                <input
                  value={stipend}
                  onChange={(e) =>
                    setStipend(e.target.value)
                  }
                  placeholder="e.g. ₹25,000/month"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Salary
                </label>

                <input
                  value={salary}
                  onChange={(e) =>
                    setSalary(e.target.value)
                  }
                  placeholder="e.g. ₹8-12 LPA"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Deadline
                </label>

                <input
                  value={deadline}
                  onChange={(e) =>
                    setDeadline(e.target.value)
                  }
                  placeholder="YYYY-MM-DD"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              Skills
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SkillInput
                label="Required Skills"
                items={required}
                input={requiredInput}
                onInputChange={setRequiredInput}
                onAdd={(value) =>
                  addSkill(
                    value,
                    required,
                    setRequired
                  )
                }
                onRemove={(index) =>
                  removeSkill(
                    index,
                    required,
                    setRequired
                  )
                }
              />

              <SkillInput
                label="Preferred Skills"
                items={preferred}
                input={preferredInput}
                onInputChange={setPreferredInput}
                onAdd={(value) =>
                  addSkill(
                    value,
                    preferred,
                    setPreferred
                  )
                }
                onRemove={(index) =>
                  removeSkill(
                    index,
                    preferred,
                    setPreferred
                  )
                }
              />
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/industry/opportunities"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Publish Opportunity
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function SkillInput({
  label,
  items,
  input,
  onInputChange,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  input: string;
  onInputChange: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) =>
            onInputChange(e.target.value)
          }
          placeholder="Add skill and press enter"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(input);
              onInputChange("");
            }
          }}
        />

        <button
          type="button"
          onClick={() => {
            onAdd(input);
            onInputChange("");
          }}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
          >
            {item}

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded-full p-0.5 text-indigo-400 hover:text-indigo-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
