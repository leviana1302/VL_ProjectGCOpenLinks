// ==UserScript==
// @name         VL_ProjectGCOpenLinks
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Öffnet die ersten N nicht-gecheckte coord.info Links in neuen Tabs und aktiviert deren Checkboxen
// @author       Verena
// @match        https://project-gc.com/User/VirtualGPS*
// @updateURL    https://raw.githubusercontent.com/leviana1302/VL_ProjectGCOpenLinks/main/VL_ProjectGCOpenLinks.js
// @downloadURL  https://raw.githubusercontent.com/leviana1302/VL_ProjectGCOpenLinks/main/VL_ProjectGCOpenLinks.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        const vgpsMenu = document.getElementById('vgps-menu');

        if (!vgpsMenu) {
            console.log('vgps-menu nicht gefunden');
            return;
        }

        // Erstelle das Select-Dropdown
        const select = document.createElement('select');
        select.id = 'vgps-link-count';
        select.style.cssText = `
            padding: 6px 10px;
            margin-right: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f5f5f5;
            cursor: pointer;
        `;

        [5, 10, 15, 20].forEach(num => {
            const option = document.createElement('option');
            option.value = num;
            option.textContent = num;
            if (num === 5) option.selected = true;
            select.appendChild(option);
        });

        // Erstelle den Button
        const button = document.createElement('button');
        button.textContent = '➡️';
        button.id = 'vgps-quick-open';
        button.style.cssText = `
            padding: 8px 12px;
            font-size: 16px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f5f5f5;
            transition: background-color 0.2s;
        `;

        // Container für Button und Select
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; gap: 5px; align-items: center;';
        container.appendChild(button);
        container.appendChild(select);

        // Füge Container am Anfang von vgps-menu ein
        vgpsMenu.insertBefore(container, vgpsMenu.firstChild);

        // Click-Handler für den Button
        button.addEventListener('click', function() {
            const vgpsTable = document.getElementById('vgps-table');

            if (!vgpsTable) {
                console.log('vgps-table nicht gefunden');
                return;
            }

            // Hole die gewählte Anzahl
            const count = parseInt(select.value);
            console.log(`Öffne ${count} nicht-gecheckte Links`);

            // Finde alle Reihen in der Tabelle
            const allRows = vgpsTable.querySelectorAll('div[role="row"]');
            console.log(`Gefundene Zeilen: ${allRows.length}`);

            // Filtere Reihen mit unchecked Checkboxen und coord.info Links
            const uncheckedRows = Array.from(allRows).filter(row => {
                const checkbox = row.querySelector('input[type="checkbox"]');
                const link = row.querySelector('a[href^="https://coord.info/"]');
                return checkbox && !checkbox.checked && link;
            });

            console.log(`Nicht-gecheckte Reihen mit Links: ${uncheckedRows.length}`);

            // Nimm nur die ersten N
            const selectedRows = uncheckedRows.slice(0, count);
            console.log(`Öffne: ${selectedRows.length} Links`);

            if (selectedRows.length === 0) {
                alert(`Keine nicht-gecheckte coord.info Links gefunden`);
                return;
            }

            // Öffne Links und aktiviere Checkboxen
            selectedRows.forEach((row, index) => {
                setTimeout(() => {
                    const link = row.querySelector('a[href^="https://coord.info/"]');
                    const checkbox = row.querySelector('input[type="checkbox"]');

                    if (link && checkbox) {
                        console.log(`Öffne Link ${index + 1}: ${link.href}`);

                        // Aktiviere Checkbox
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                        checkbox.dispatchEvent(new Event('click', { bubbles: true }));

                        // Speichere altes target
                        const oldTarget = link.getAttribute('target');

                        // Setze target="_blank" und klicke
                        link.setAttribute('target', '_blank');
                        link.click();

                        // Stelle altes target wieder her
                        if (oldTarget) {
                            link.setAttribute('target', oldTarget);
                        } else {
                            link.removeAttribute('target');
                        }
                    }
                }, index * 800);
            });

            console.log(`${selectedRows.length} Links geplant`);
        });

        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#e0e0e0';
        });

        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#f5f5f5';
        });

    }, 500);

})();
