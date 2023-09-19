import React, { useState } from "react";
import "./styles.css";
import "./index.css";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const googleFontsStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
`;

const initialCode = `0x2CB99F193549681e06C6770dDD5543812B4FaFE8 10
0x2CB99F193549681e06C6770dDD5543812B4FaFE8 10
0xF4aDE8368DDd835B70b625CF7E3E1Bc5791D18C1 10k
0x09ae5A64465c18718a46b3aD946270BD3E5e6aaB,10
0x8B3392483BA26D65E331dB86D4F430E9B3814E5=20`;

export default function App() {
  const [codeValue, setCodeValue] = useState(initialCode);
  const [duplicateLines, setDuplicateLines] = useState([]);
  const [userChoice, setUserChoice] = useState(null);
  const [proceedClicked, setProceedClicked] = useState(false);
  const [invalidAmountLines, setInvalidAmountLines] = useState([]);

  const findDuplicates = (code) => {
    const lines = code.split("\n");
    const seen = {};
    const duplicates = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const [name, amount] = line.split(/[=, ]+/);

      if (amount && !isNaN(amount)) {
        if (seen[name]) {
          if (!duplicates[name]) {
            duplicates[name] = [];
            duplicates[name].push(seen[name]);
          }
          duplicates[name].push(i + 1);
        } else {
          seen[name] = i + 1;
        }
      } else {
        setInvalidAmountLines((prevLines) => [...prevLines, i + 1]);
        return { duplicates, invalid: [...invalidAmountLines, i + 1] };
      }
    }
    return { duplicates, invalid: [] };
  };

  const handleCodeChange = (newCode) => {
    setProceedClicked(false);

    setCodeValue(newCode);
    setUserChoice(null);
    setDuplicateLines([]);
    setInvalidAmountLines([]);
  };

  const handleProceed = () => {
    setProceedClicked(true);
    setInvalidAmountLines([]);
    const { duplicates, invalid } = findDuplicates(codeValue);
    // Check if there are any duplicate lines or invalid amount lines
    const hasErrors =
      Object.keys(duplicates).length > 0 || invalid.length > 0;

    if (hasErrors) {
      setDuplicateLines(duplicates);
    } else {
      notify();
    }
  };

  const handleCombine = () => {
    setUserChoice("combine");
    const updatedCode = combineAmounts(codeValue);
    setCodeValue(updatedCode);
    setDuplicateLines([]);
    console.log(userChoice);
  };

  const handleKeepFirst = () => {
    setUserChoice("keepFirst");
    const updatedCode = keepFirst(codeValue);
    setCodeValue(updatedCode);
    setDuplicateLines([]);
  };

  const combineAmounts = (code) => {
    const lines = code.split("\n");
    const seen = {};
    const updatedLines = [];

    for (const line of lines) {
      const [name, amount] = line.split(/\s+/);
      const existingLine = seen[name];

      if (existingLine !== undefined) {
        // A line with this name has been seen before
        // Combine the amounts with the existing line
        const existingAmount = parseFloat(
          updatedLines[existingLine].split(/\s+/)[1]
        );
        const newAmount = existingAmount + parseFloat(amount);
        updatedLines[existingLine] = `${name} ${newAmount}`;
      } else {
        // First occurrence of this name, store it in 'seen' object
        seen[name] = updatedLines.length;
        updatedLines.push(line);
      }
    }

    return updatedLines.join("\n");
  };

  const keepFirst = (code) => {
    const lines = code.split("\n");
    const seen = {};
    const updatedLines = [];

    for (const line of lines) {
      const [name] = line.split(/\s+/);

      if (!seen[name]) {
        seen[name] = true;
        updatedLines.push(line);
      }
    }
    return updatedLines.join("\n");
  };

  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, language)
      .split("\n")
      .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
      .join("\n");


  function notify() {
    toast.success("Success!");
  }


  return (
    <main className="flex flex-col  justify-between px-[4%] py-4  bg-gray-200">


      <style>{googleFontsStyle}</style>

      <div className="flex justify-between py-6">
        <img className="w-64 main-app-footer__logo" alt="Footer Logo" src="https://www.gatherdao.com/static/media/gd-new-logo-light.44e866ff69c1ad3d75879f9741b657ee.svg"></img>
        <div className="flex gap-4">
          <img alt="Search Icon" src="https://www.gatherdao.com/static/media/search.63b39a9904c6c8877c3757f32521a903.svg"></img>
          <img alt="Search Icon" src="https://www.gatherdao.com/static/media/menu.2370ef6424304fee65eecb3caddddf0d.svg"></img>
        </div>
      </div>

      <div className="px-[10%] gap-2 flex flex-col bg-white mb-4 py-8 rounded-[20px]">

        <div className="-mx-[10%] flex justify-between items-center text-xs text-gray-400 pb-10">
          <div className="flex flex-col items-center">
            <img alt="Ethereum Icon" src="https://www.gatherdao.com/static/media/steps-icon2.b09fbf71d4029bbae24759030880177e.svg"></img>
            <div>Prepare</div>
          </div>

          <div className="flex grow bg-gray-300 h-[0.5px] mx-4"></div>

          <div className="flex flex-col items-center">
            <img alt="Ethereum Icon" src="https://www.gatherdao.com/static/media/steps-icon2-gray.2bb3cc6ed6ed718ab1853401f649f757.svg"></img>
            <div>Approve</div>
          </div>

          <div className="flex grow bg-gray-300 h-[0.5px] mx-4"></div>

          <div className="flex flex-col items-center">
            <img alt="Ethereum Icon" src="https://www.gatherdao.com/static/media/steps-icon2-gray.2bb3cc6ed6ed718ab1853401f649f757.svg"></img>
            <div>Scatter</div>
          </div>
        </div>

        <div className="font-medium text-3xl">Prepare to scatter</div>
        <p>We support the following Networks</p>
        <div className="text-base font-medium pb-8 flex gap-8 pt-4 ">
          <div className="flex items-center">
            <img alt="Ethereum Icon" src="https://www.gatherdao.com/static/media/ethereum-oval.bc107f510b40acf5ca685f3236969a9e.svg"></img>
            <div>Ethereum Mainnet</div>
          </div>
          <div className="items-center flex">
            <img alt="Binance Icon" src="https://www.gatherdao.com/static/media/binance-oval.42de5156af7753f44e1d51ddc9ed660b.svg"></img>
            <div>Binance Smart Chain</div>
          </div>
        </div>

        <label className="font-semibold">Token Address</label>
        <input className="p-4 border-2 border-gray-300 rounded-[10px] mb-4 " />


        <label className="font-semibold">Addresses with Amounts</label>

        <div className="border-2 border-gray-300 rounded-[10px] mb-4 h-56 overflow-y-auto">
          <Editor
            value={codeValue}
            onValueChange={handleCodeChange}
            highlight={(code) => hightlightWithLineNumbers(code, languages.js)}
            padding={10}
            textareaId="codeArea"
            className="editor rounded-lg "
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 18,
              outline: 0,
              border: 'none',
            }}
          />
        </div>

        <div className="flex justify-between">
          <div className="pb-4 font-medium">Separated by ',' or ' ' or '='</div>
          <div className="pb-4 cursor-pointer my-popup">
            <Popup className="popups"
              trigger={<button className="button hover:underline"> Show Example</button>}
              modal
              nested
            >
              {close => (
                <div className="modal rounded-[10px]  p-4 text-center bg-gray-200">
                  <div className="font-semibold text-2xl ">TEXT</div>
                  <p className="py-4 overflow-auto">0xD50ba32a4098C075dC2Z52f9130C5F04a72b11AF 5.565
                    0x6C9a2aF2f6C8f808BE6aE89A5B3C80f2414480dc,4.242
                    0x3c32F97E9398A6cc97VASfaA37b3Aa5E068b9C4c=100</p>
                </div>
              )}
            </Popup>
          </div>

        </div>

        <button className="bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800 p-4 mb-6 rounded-full text-white" onClick={() => { handleProceed() }}>Next</button>

        {proceedClicked && Object.keys(duplicateLines).length > 0 && (
          <div className="text-sm">
            <div className="flex justify-between text-red-500 text-sm">
              <label>Duplicated</label>
              <div>
                <button className="pr-1" onClick={handleCombine}>Combine </button>
                <button onClick={handleKeepFirst}>| Keep First</button>
              </div>
            </div>

            {Object.keys(duplicateLines).map((name) => (
              <div key={name} className="flex items-center gap-8 border-2 border-red-400 p-2 text-red-500 my-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p key={name}>
                  Addresses {name} encountered duplicate in line : {duplicateLines[name].join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}


        {invalidAmountLines.length > 0 && (
          <div className="text-sm" >
            {invalidAmountLines.map((lineNumber) => (
              <div key={lineNumber} className="flex items-center gap-8 border-2 border-red-500 p-2 text-red-600 my-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p> Line {lineNumber} wrong amount</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer
        position="bottom-center"
        theme="colored" />

      <footer className="text-left text-lg bg-white p-4  rounded-[20px]">
        <img className="main-app-footer__logo pb-8" alt="Footer Logo" src="https://www.gatherdao.com/static/media/gd-new-logo-light.44e866ff69c1ad3d75879f9741b657ee.svg"></img>
        <p className="pb-8">Full Stack Decentralized Fundraising Platform</p>
        <div className="mb-12 rounded-lg w-36 h-[3px] overflow-y-auto bg-gradient-to-r from-blue-400 to-pink-600"></div>
        <p> &copy;  All rights reserved 2023 </p>
      </footer>

    </main >
  );
}




