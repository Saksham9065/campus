"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/lib/users";

export default function AcademiaProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["academia"]}>
      <AcademiaProfile />
    </ProtectedRoute>
  );
}

function AcademiaProfile() {
  const { user, profile } = useAuth();

  const [institution, setInstitution] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");

  const [expertise, setExpertise] = useState<string[]>([]);
  const [researchInterests, setResearchInterests] =
    useState<string[]>([]);

  const [expertiseInput, setExpertiseInput] =
    useState("");

  const [researchInput, setResearchInput] =
    useState("");

  const [publications, setPublications] = useState("");
  const [projects, setProjects] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (!profile || initialized.current) return;

    initialized.current = true;

    const academic = profile.academiaProfile;

    setInstitution(
      academic?.institution ||
        profile.college ||
        ""
    );

    setDepartment(
      academic?.department ||
        profile.department ||
        ""
    );

    setDesignation(
      academic?.designation ||
        profile.designation ||
        ""
    );

    setSpecialization(
      academic?.specialization ||
        profile.specialization ||
        ""
    );

    setExperience(
      academic?.experience !== undefined
        ? String(academic.experience)
        : profile.experience !== undefined
        ? String(profile.experience)
        : ""
    );

    setExpertise(
      academic?.expertise || []
    );

    setResearchInterests(
      academic?.researchInterests || []
    );

    setPublications(
      academic?.publications !== undefined
        ? String(academic.publications)
        : ""
    );

    setProjects(
      academic?.projects !== undefined
        ? String(academic.projects)
        : ""
    );
  }, [profile]);

  function addExpertise() {
    const value = expertiseInput.trim();

    if (!value) return;

    if (!expertise.includes(value)) {
      setExpertise([...expertise, value]);
    }

    setExpertiseInput("");
  }

  function addResearchInterest() {
    const value = researchInput.trim();

    if (!value) return;

    if (!researchInterests.includes(value)) {
      setResearchInterests([
        ...researchInterests,
        value,
      ]);
    }

    setResearchInput("");
  }

  async function saveProfile() {
    if (!user) return;

    try {
      setSaving(true);
      setSaved(false);

      await updateUserProfile(user.uid, {
        college: institution,
        department,
        designation,
        specialization,
        experience: Number(experience) || 0,

        academiaProfile: {
          institution,
          department,
          designation,
          specialization,
          experience:
            Number(experience) || 0,
          expertise,
          researchInterests,
          publications:
            Number(publications) || 0,
          projects:
            Number(projects) || 0,
          profileCompleted: true,
        },
      });

      setSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-5 py-4">
          <Link
            href="/academician"
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="font-black">
              Academic Profile
            </h1>

            <p className="text-xs text-slate-500">
              Build your industry-ready academic profile
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div>
            <p className="text-sm font-bold text-indigo-600">
              Professional Identity
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Tell industry what you bring
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your expertise will be used to discover relevant
              research, training, mentorship and collaboration
              opportunities.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Field
              label="Institution"
              value={institution}
              onChange={setInstitution}
              placeholder="University / College"
            />

            <Field
              label="Department"
              value={department}
              onChange={setDepartment}
              placeholder="Computer Science"
            />

            <Field
              label="Designation"
              value={designation}
              onChange={setDesignation}
              placeholder="Assistant Professor"
            />

            <Field
              label="Specialization"
              value={specialization}
              onChange={setSpecialization}
              placeholder="Data Science"
            />

            <Field
              label="Experience"
              value={experience}
              onChange={setExperience}
              placeholder="Years"
              type="number"
            />

            <Field
              label="Publications"
              value={publications}
              onChange={setPublications}
              placeholder="Number of publications"
              type="number"
            />

            <Field
              label="Industry / Research Projects"
              value={projects}
              onChange={setProjects}
              placeholder="Number of projects"
              type="number"
            />
          </div>

          {/* Expertise */}
          <TagEditor
            title="Areas of Expertise"
            placeholder="e.g. Machine Learning"
            value={expertiseInput}
            setValue={setExpertiseInput}
            tags={expertise}
            setTags={setExpertise}
            onAdd={addExpertise}
          />

          {/* Research */}
          <TagEditor
            title="Research Interests"
            placeholder="e.g. Healthcare AI"
            value={researchInput}
            setValue={setResearchInput}
            tags={researchInterests}
            setTags={setResearchInterests}
            onAdd={addResearchInterest}
          />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              Save Academic Profile
            </button>

            {saved && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Profile saved successfully
              </span>
            )}
          </div>
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
    <label className="block">
      <span className="text-sm font-bold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}

function TagEditor({
  title,
  placeholder,
  value,
  setValue,
  tags,
  setTags,
  onAdd,
}: {
  title: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  onAdd: () => void;
}) {
  return (
    <div className="mt-7">
      <p className="text-sm font-bold text-slate-700">
        {title}
      </p>

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
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
        />

        <button
          onClick={onAdd}
          type="button"
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
              onClick={() =>
                setTags(
                  tags.filter(
                    (item) => item !== tag
                  )
                )
              }
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
