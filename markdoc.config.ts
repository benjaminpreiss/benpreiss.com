import { defineMarkdocConfig, component } from "@astrojs/markdoc/config";
import { projectRecordingSchema } from "./src/lib/project-media";
import buttons from "./content/technology-buttons.json";

const locale = { type: String, required: true, matches: ["de", "en"] };
const text = { type: String, required: true, matches: /\S/ };
const sectionId = { type: String, matches: /^[a-z][a-z0-9-]*$/ };
const dimension = {
  type: Number,
  required: true,
  validate(value: unknown) {
    return typeof value === "number" && Number.isInteger(value) && value > 0
      ? []
      : [
          {
            id: "invalid-dimension",
            level: "error" as const,
            message: "Image dimensions must be positive integers",
          },
        ];
  },
};

const recording = {
  type: Object,
  required: true,
  validate(value: unknown) {
    const result = projectRecordingSchema.safeParse(value);
    return result.success
      ? []
      : [
          {
            id: "invalid-recording",
            level: "error" as const,
            message: `Invalid project recording: ${result.error.message}`,
          },
        ];
  },
};

export default defineMarkdocConfig({
  tags: {
    IntroScreen: { render: component("./src/components/IntroScreen.astro") },
    Language: { render: component("./src/components/Language.astro"), attributes: { locale } },
    LegalContent: { render: component("./src/components/LegalContent.astro") },
    LegalSection: { render: component("./src/components/LegalSection.astro") },
    LegalColumns: { render: component("./src/components/LegalColumns.astro") },
    LegalHeading: {
      render: component("./src/components/LegalHeading.astro"),
      attributes: {
        id: { type: String, required: true, matches: /^[a-z][a-z0-9_-]*$/ },
        level: {
          type: Number,
          required: true,
          validate(value: unknown) {
            return value === 1 || value === 2 || value === 3
              ? []
              : [
                  {
                    id: "invalid-heading-level",
                    level: "error" as const,
                    message: "Legal heading level must be 1, 2 or 3",
                  },
                ];
          },
        },
        title: text,
      },
    },
    LegalNotice: { render: component("./src/components/LegalNotice.astro") },
    FooterLinks: { render: component("./src/components/FooterLinks.astro") },
    FooterSocial: { render: component("./src/components/FooterSocial.astro") },
    Imprint: { render: component("./src/components/Imprint.astro"), attributes: { title: text } },
    ImprintEntry: {
      render: component("./src/components/ImprintEntry.astro"),
      attributes: { title: text },
    },
    Contact: {
      render: component("./src/components/Contact.astro"),
      attributes: { id: { ...sectionId, required: true }, title: text },
    },
    ContactIntro: { render: component("./src/components/ContactIntro.astro") },
    ContactPhone: {
      render: component("./src/components/ContactPhone.astro"),
      attributes: {
        title: text,
        phone: { type: String, required: true, matches: /^\+[0-9]+$/ },
        phoneLabel: text,
        copy: text,
        copied: text,
        copyFailed: text,
      },
    },
    ContactForm: {
      render: component("./src/components/ContactForm.astro"),
      attributes: {
        id: { ...sectionId, required: true },
        title: text,
        unavailable: text,
      },
    },
    ContactInput: {
      render: component("./src/components/ContactInput.astro"),
      attributes: {
        id: { ...sectionId, required: true },
        name: { type: String, required: true, matches: ["name", "email", "message"] },
        label: text,
        type: { type: String, matches: ["text", "email", "textarea"] },
        placeholder: { type: String, matches: /\S/ },
      },
    },
    ContactFootnote: { render: component("./src/components/ContactFootnote.astro") },
    ContactButton: {
      render: component("./src/components/ContactButton.astro"),
      attributes: { unavailable: text },
    },
    Intro: { render: component("./src/components/Intro.astro"), attributes: { id: sectionId } },
    IntroColumn: { render: component("./src/components/IntroColumn.astro") },
    IntroText: { render: component("./src/components/IntroText.astro") },
    SocialLinks: { render: component("./src/components/SocialLinks.astro") },
    SocialLink: {
      render: component("./src/components/SocialLink.astro"),
      attributes: {
        name: text,
        href: { type: String, required: true, matches: /^https?:\/\/[^\s]+$/ },
        icon: { type: String, required: true, matches: /^\/(?!\/)[a-zA-Z0-9/_.-]+$/ },
      },
    },
    ProfilePicture: {
      render: component("./src/components/ProfilePicture.astro"),
      attributes: {
        src: { type: String, required: true, matches: /^\/(?!\/)[a-zA-Z0-9/_.-]+$/ },
        alt: text,
        width: dimension,
        height: dimension,
      },
    },
    ProjectIntro: {
      render: component("./src/components/ProjectIntro.astro"),
      attributes: { id: sectionId },
    },
    Projects: {
      render: component("./src/components/Projects.astro"),
      attributes: { id: sectionId },
    },
    Project: {
      render: component("./src/components/Project.astro"),
      attributes: {
        id: sectionId,
        title: text,
        href: { type: String, required: true, matches: /^https?:\/\/[^\s]+$/ },
        linkText: text,
        color: { type: String, required: true, matches: /^#[a-f0-9]{6}$/i },
        mobile: recording,
        desktop: recording,
        locale,
      },
    },
    TechnologyButtons: {
      render: component("./src/components/TechnologyButtons.astro"),
      attributes: {
        names: {
          type: Array,
          required: true,
          validate(value) {
            return Array.isArray(value) &&
              value.every((name) => typeof name === "string" && Object.hasOwn(buttons, name))
              ? []
              : [
                  {
                    id: "invalid-buttons",
                    level: "error",
                    message: "Unknown technology button",
                  },
                ];
          },
        },
      },
    },
  },
  nodes: {
    link: {
      render: component("./src/components/ProseLink.astro"),
      attributes: { href: { type: String }, title: { type: String } },
    },
  },
});
