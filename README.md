# Qmaker - Make Perfect Question Papers in Minutes

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)

A modern, feature-rich web application for creating professional MCQ (Multiple Choice Question) papers with ease. Built with React.js, Qmaker offers a seamless experience for educators to create, customize, and export question papers in multiple formats.

## ✨ Features

### 🎯 Core Features
- **Dual Mode System**: Choose between Basic (quick and simple) or Professional (advanced features) modes
- **Multi-language Support**: Available in English, Hindi, and Odia
- **Auto-save Functionality**: Never lose your work with automatic browser storage
- **Import/Export Projects**: Save and load your question papers as JSON files
- **PDF Export**: Generate professional PDFs with customizable layouts
- **Dark Mode**: Easy on the eyes with full dark theme support

### 📝 Question Editor
- **Rich Text Editing**: Format questions with bold, italic, underline
- **Mathematical Expressions**: Built-in math input support for equations
- **Multiple Option Layouts**: Vertical, Horizontal, or Grid (2x2) layouts
- **Drag & Drop Reordering**: Easily reorganize questions
- **Page Break Control**: Manage page breaks for perfect printing
- **Question Templates**: Quick-add from predefined templates
- **Bulk Operations**: Add multiple questions at once

### 🎨 Customization
- **Multiple Templates**: Classic, Modern, Minimal, and Professional styles
- **Font Controls**: Customize font family, size, and spacing
- **Color Themes**: Choose primary colors for your papers
- **Layout Options**: Control margins, spacing, and alignment
- **Header/Footer**: Add custom headers and footers
- **Instructions Section**: Include detailed exam instructions

### 📊 Question Management
- **Question Bank**: Save and reuse questions
- **Categories**: Organize questions by topics
- **Difficulty Levels**: Mark questions as Easy, Medium, or Hard
- **Marks Allocation**: Assign marks to each question
- **Answer Key Generation**: Automatically create answer sheets

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/himanshu-hivecorp/qmaker.git
cd qmaker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Building for Production

```bash
npm run build
# or
yarn build
```

The optimized production build will be created in the `build` folder.

## 🖥️ Technology Stack

- **Frontend Framework**: React.js 18.2.0
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Generation**: jsPDF with html2canvas
- **State Management**: React Hooks
- **Storage**: LocalStorage API
- **Build Tool**: Create React App

## 📁 Project Structure

```
qmaker/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   └── redesign/
│   │       ├── WelcomeScreenNew.js
│   │       ├── TemplateSelectorNew.js
│   │       ├── QuestionEditorSimple.js
│   │       ├── QuestionEditorProfessional.js
│   │       ├── ExportViewNew.js
│   │       └── HeaderMinimal.js
│   ├── styles/
│   │   └── modern.css
│   ├── utils/
│   │   ├── localStorageManager.js
│   │   ├── exportUtils.js
│   │   └── templateUtils.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 💡 Usage Guide

### Creating Your First Question Paper

1. **Start a New Project**: Click "Create New Paper" on the welcome screen
2. **Enter Project Details**: Name your exam and select subject/class
3. **Choose a Mode**: 
   - Basic Mode: For quick, simple papers
   - Professional Mode: For advanced features and customization
4. **Select a Template**: Pick from Classic, Modern, Minimal, or Professional
5. **Add Questions**: Use the editor to create your questions
6. **Customize**: Adjust fonts, colors, and layouts to your preference
7. **Preview**: Check how your paper will look
8. **Export**: Download as PDF or save the project

### Tips & Tricks

- Use keyboard shortcuts for faster editing (Ctrl+S to save)
- Enable auto-save to prevent data loss
- Use templates for consistent formatting
- Preview before exporting to ensure perfect layout
- Save projects as JSON for future editing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Himanshu**
- GitHub: [@himanshu-hivecorp](https://github.com/himanshu-hivecorp)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape Qmaker
- Special thanks to the React.js community for excellent documentation
- Icons provided by Lucide React

## 📧 Support

For support, please open an issue in the GitHub repository or contact the author.

---

**© 2025 Qmaker** - Made with ❤️ by Himanshu