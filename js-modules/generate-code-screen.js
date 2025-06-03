import generateCode from './generate-code.js'

import 'prismjs'; // Core
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/components/prism-c.js';    // Base language
import 'prismjs/components/prism-cpp.js';  // C++ extends C

import Prism from 'prismjs';

export default class GenerateCodeScreen {
    constructor(mainAppInstance) {
        this.mainApp = mainAppInstance;

        this.createBaseLayout();
    }

    createBaseLayout() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('gen-code-wrapper');
        document.body.appendChild(this.wrapper);

        this.container = document.createElement('div');
        this.container.classList.add('gen-code-container');
        this.wrapper.appendChild(this.container);

        this.header = document.createElement('div');
        this.header.classList.add('gen-code-header');
        this.container.appendChild(this.header);

        this.filename = document.createElement('span');
        this.filename.classList.add('gen-code-filename');
        this.filename.textContent = 'coordinates.h';
        this.header.appendChild(this.filename);

        this.controls = document.createElement('div');
        this.controls.classList.add('gen-code-controls');
        this.header.appendChild(this.controls);

        this.copyBtn = document.createElement('button');
        this.copyBtn.classList.add('gen-code-copy-btn', 'icon-button');
        this.copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" />
            <path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" />
        </svg>`;
        this.controls.appendChild(this.copyBtn);
        this.copyBtn.addEventListener('click', () => {
            const text = this.code.textContent;
            navigator.clipboard.writeText(text).then(() => {
                this.copyBtn.classList.add('copied');
                setTimeout(() => this.copyBtn.classList.remove('copied'), 1500);
            });
        });

        this.downloadBtn = document.createElement('button');
        this.downloadBtn.classList.add('gen-code-download-btn', 'icon-button');
        this.downloadBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        this.controls.appendChild(this.downloadBtn);
        this.downloadBtn.addEventListener('click', () => {
            const text = this.code.textContent;
            const blob = new Blob([text], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = this.filename.textContent || 'code.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        this.close = document.createElement('button');
        this.close.classList.add('gen-code-close-btn', 'button');
        this.close.textContent = 'Close';
        this.controls.appendChild(this.close);
        this.close.addEventListener('click', this.hide.bind(this));

        this.pre = document.createElement('pre');
        this.pre.classList.add('gen-code-line-numbers', 'line-numbers', 'small-scrollbar'); // 'line-numbers' required by Prism.js
        this.container.appendChild(this.pre);
        
        this.code = document.createElement('code');
        this.code.classList.add('code-el', 'language-cpp'); // 'language-cpp' required by Prism.js
        this.pre.appendChild(this.code);
    }

    show() {
        this.wrapper.style.opacity = '1';
        this.wrapper.style.pointerEvents = 'all';

        const rawCode = generateCode(this.mainApp.data.stops, this.mainApp.data.routes);

        this.code.textContent = rawCode;
        Prism.highlightElement(this.code);
    }

    hide() {
        this.wrapper.style.opacity = '';
        this.wrapper.style.pointerEvents = '';
    }
}