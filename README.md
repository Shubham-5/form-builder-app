# Form Builder

## Project Overview

A sophisticated, user-friendly form builder application built with React, Next.js, and TypeScript. This project allows users to dynamically create, preview, publish and submit forms with multiple input types.

## 🌟 Features

### Form Creation

- Start with an empty form
- Add and customize form questions
- Support for 5 different input types:
  1. Short Answer
  2. Long Answer
  3. Single Select
  4. Number
  5. URL

### Drag and Drop Interface

- Reorder form fields using intuitive drag-and-drop functionality
- Smooth UI for adding and modifying questions

### Form Management

- Save forms as drafts
- Publish completed forms
- Preview form before submission
- Submit form on published

### Form Submission

- Track form completeness percentage
- Display success message upon 100% completion

## 🛠 Tech Stack

- **Frontend**: React, Next.js
- **State Management**: React Context
- **CSS Library**: Tailwind CSS
- **Drag and Drop**: @dnd-kit
- **Icons**: Lucide React
- **Language**: TypeScript

## 📦 Prerequisites

- Node.js (v18 or later)
- npm or yarn

## 🔧 Setup Instructions

1. Clone the repository

```bash
git clone https://github.com/Shubham-5/form-builder-app.git
cd form-builder
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run development server

```bash
npm run dev
# or
yarn dev
```

4. Open `http://localhost:3000` in your browser

## 📂 Project Structure

```
├── components/
│   ├── form/
│   │   ├── form-field.tsx
│   │   └── form-preview.tsx
│   └── ui/
│       ├── button.tsx
│       └── input.tsx
├── context/
│   └── form-context.tsx
├── hooks/
│   └── use-form.tsx
├── lib/
│   └── utils.tsx
├── app/
│   ├── layout.tsx           # Application layout
│   ├── page.tsx             # Homepage
│   ├── (forms)/             # Group for form-related pages
│   │   ├── form/            # Page to fill a form
│   │   │   ├── page.tsx
│   │   │   └── preview/     # Nested preview page under form
│   │   │       └── page.tsx
│   │   ├── draft/           # Drafts page
│   │   │   └── page.tsx
│   │   ├── published/       # Published forms page
│   │   │   └── page.tsx
│   │   ├── submitted/       # Submitted forms page
│   │   │   └── page.tsx
└── README.md
```

## 🔍 Key Components

### Home Page (`/`)

- Create new form
- View draft, published, and submitted forms

### Form Builder (`/form`)

- Add questions
- Change input types
- Drag and reorder fields
- Save as draft or publish

### Form Preview (`/form/preview`)

- Complete form
- Track form completeness
- Submit form
- Display success message
