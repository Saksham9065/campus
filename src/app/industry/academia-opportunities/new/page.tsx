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

import {
  createAcademiaOpportunity,
  type AcademiaOpportunityMode,
  type AcademiaOpportunityType,
} from "@/lib/academia";

const types: AcademiaOpportunityType[] = [
  "Faculty Internship",
  "Industrial Training",
  "FDP",
  "Consultancy",
  "Research Project",
  "Mentorship",
  "Guest Lecture",
  "Workshop",
  "Innovation Challenge",
  "Live Project",
];

export default function NewAcademiaOpportunity() {
  return (
    <ProtectedRoute allowedRoles={["industry"]}>
      <Form />
    </ProtectedRoute>
  );
}

function Form() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] =
    useState<AcademiaOpportunityType>(
      "Faculty Internship"
    );

  const [mode, setMode] =
    useState<AcademiaOpportunityMode>("Hybrid");

  const [location, setLocation] = useState("");
  const [description, setDescription] =
    useState("");

  const [duration, setDuration] = useState("");
  const [compensation, setCompensation] =
    useState("");
  const [deadline, setDeadline] = useState("");

  const [required, setRequired] =
    useState<string[]>([]);

  const [preferred, setPreferred] =
    useState<string[]>([]);

  const [requiredInput, setRequiredInput] =
    useState("");

  const [preferredInput, setPreferredInput] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addTag(
    value: string,
    tags: string[],
    setter: (value: string[]) => void,
    inputSetter: (value: string) => void
  ) {
    const clean = value.trim();

    if (!clean) return;

    if (!tags.includes(clean)) {
      setter([...tags, clean]);
    }

    inputSetter("");
  }

  async function submit() {
    if (!user || !profile) return;

    if (!title.trim()) {
      setError("Please enter an opportunity title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (required.length === 0) {
      setError(
        "Add at least one required expertise."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createAcademiaOpportunity({
        title,
        organization:
          profile.companyName ||
          profile.name,
        organizationId: user.uid,

        type,
        mode,

        location,
        description,

        requiredExpertise: required,
        preferredExpertise: preferred,

        duration,
        compensation,
        deadline,
      });

      router.push("/industry");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to create the collaboration opportunity."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-5 py-4">
          <Link
            href="/industry"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="font-black">
              Post Academia Collaboration
            </h1>

            <p className="text-xs text-slate-500">
              Connect your organization with academic experts
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Opportunity Title"
              value={title}
              onChange={setTitle}
              placeholder="Industry Research Collaboration"
            />

            <label>
              <span className="text-sm font-bold">
                Opportunity Type
              </span>

              <select
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as AcademiaOpportunityType
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              >
                {types.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-bold">
                Mode
              </span>

              <select
                value={mode}
                onChange={(e) =>
                  setMode(
                    e.target.value as AcademiaOpportunityMode
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              >
                <option>Online</option>
                <option>Offline</option>
                <option>Hybrid</option>
              </select>
            </label>

            <Field
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="City / Campus"
            />

            <Field
              label="Duration"
              value={duration}
              onChange={setDuration}
              placeholder="4 weeks"
            />

            <Field
              label="Compensation"
              value={compensation}
              onChange={setCompensation}
              placeholder="Paid / Unpaid / Honorarium"
            />

            <Field
              label="Application Deadline"
              value={deadline}
              onChange={setDeadline}
              placeholder="Select date"
              type="date"
            />
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-bold">
              Description
            </span>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={7}
              placeholder="Describe the collaboration..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-indigo-500"
            />
          </label>

          <TagEditor
            title="Required Expertise"
            value={requiredInput}
            setValue={setRequiredInput}
            tags={required}
            setTags={setRequired}
            onAdd={() =>
              addTag(
                requiredInput,
                required,
                setRequired,
                setRequiredInput
              )
            }
          />

          <TagEditor
            title="Preferred Expertise"
            value={preferredInput}
            setValue={setPreferredInput}
            tags={preferred}
            setTags={setPreferred}
            onAdd={() =>
              addTag(
                preferredInput,
                preferred,
                setPreferred,
                setPreferredInput
              )
            }
          />

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={saving}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}

            Publish Collaboration
          </button>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label>
      <span className="text-sm font-bold">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
      />
    </label>
  );
}

function TagEditor({
  title,
  value,
  setValue,
  tags,
  setTags,
  onAdd,
}: {
  title: string;
  value: string;
  setValue: (value: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  onAdd: () => void;
}) {
  return (
    <div className="mt-7">
      <span className="text-sm font-bold">
        {title}
      </span>

      <div className="mt-2 flex gap-2">
        <input
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder="Add expertise..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm"
        />

        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-slate-900 px-4 text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700"
          >
            {tag}

            <button
              type="button"
              onClick={() =>
                setTags(
                  tags.filter(
                    (item) => item !== tag
                  )
                )
              }
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
