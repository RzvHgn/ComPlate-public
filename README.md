# 🧩 Com-Plate

A Chrome extension built with **React** and **TypeScript** that automates standard communications within Amazon’s internal tools.

## 🧠 Purpose
Com-Plate helps compliance associates save time by injecting pre-written messages (blurbs) directly into issue comment boxes, eliminating repetitive typing.

## ⚙️ Tech Stack
- React  
- TypeScript  
- Chrome Extensions API  
- Tailwind CSS  

## 🚀 Features
- Floating action button that opens a clean, resizable UI  
- JSON-based dynamic blurb loading (DR and SA categories)  
- Dark mode toggle for accessibility  
- Copy-to-clipboard integration  
- Works directly on `issues.amazon.com` and `sim.amazon.com`

## 💡 What I Learned
- Structuring a React extension architecture (popup + content scripts)  
- Handling Chrome extension permissions and messaging  
- Managing state and UI logic inside injected React components  
- Using AI-assisted tools to debug and optimize code efficiently while ensuring full understanding of each part

## 🧰 Installation
1. Clone this repo  
2. Run `npm install`  
3. Run `npm run build`  
4. Load the `build` folder into Chrome → Extensions → Developer mode → “Load unpacked”  

## 🔗 Links
[GitHub Repo](https://github.com/RzvHgn/Com-Plate)
