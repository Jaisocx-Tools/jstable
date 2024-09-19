class JSTable {
  constructor(htmlElementId, dataUrl, tableHeader) {
    this.MAX_WIDTH_MOBILE_LOOK_AND_FEEL = 830;

    this.htmlElementId = htmlElementId;
    this.dataUrl = dataUrl;
    this.tableHeader = tableHeader;

    this.htmlElement = document.getElementById(this.htmlElementId);

    this.assignEventsHandlres();
  }

  assignEventsHandlres() {
    window.addEventListener('resize', () => {
      this.applyColumnsWidths(this.tableHeader);
      this.adjustHeaderPaddingRight();
    });
  }

  adjustHeaderPaddingRight() {
    const tableBody = document.querySelector('#' + this.htmlElementId + ' .jstable-body');
    const scrollbarWidth = this.getScrollbarWidth(tableBody);
    const rowHeader = document.querySelector('#' + this.htmlElementId + ' .jstable-row.header');
    rowHeader.style.paddingRight = scrollbarWidth + 'px';
  }

  applyColumnsWidths(tableHeader) {
    if (window.matchMedia(`(max-width: ${this.MAX_WIDTH_MOBILE_LOOK_AND_FEEL}px)`).matches) {
      return;
    }

    let gridTemplateColumnsValue = '';

    let width = this.htmlElement.clientWidth;
    width = Math.min(document.body.clientWidth, width);

    console.log("width", width);

    const mediaStylesheetLittle = document.getElementById('jstableStylesheetLittle');

    if (width > this.MAX_WIDTH_MOBILE_LOOK_AND_FEEL) {
      gridTemplateColumnsValue = this.generateGridTemplateColumnsStyle(tableHeader);
      mediaStylesheetLittle.disabled = true;

      const tableHeadHtmlElement = document.querySelector(`#${this.htmlElementId} .jstable-row.header`);
      tableHeadHtmlElement.style.gridTemplateColumns = gridTemplateColumnsValue;
  
      const tableRowsHtmlElementsCollection = document.querySelectorAll(`#${this.htmlElementId} .jstable-body .jstable-row`);
      let rowHtmlElement = null;
      for (let i=0; i < tableRowsHtmlElementsCollection.length; i++) {
        rowHtmlElement = tableRowsHtmlElementsCollection.item(i);
        rowHtmlElement.style.gridTemplateColumns = gridTemplateColumnsValue;
      }

    } else {
      mediaStylesheetLittle.disabled = false;
    }

  }

  generateGridTemplateColumnsStyle(tableHeader) {
    let gridTemplateColumns = '3rem ';

    for (let fieldName in tableHeader) {
      let fieldMetadata = tableHeader[fieldName];
      gridTemplateColumns += fieldMetadata.width + ' ';
    }

    return gridTemplateColumns;
  }

  loadJsonData() {
    fetch(this.dataUrl)
      .then(response => response.json())
      .then(
        json => {
          this.renderTable(json);
          this.applyColumnsWidths(this.tableHeader);
          this.adjustHeaderPaddingRight();
        }
      );
  }

  renderTable(json) {
    this.htmlElement.innerHTML = '';

    let headerHtml = this.renderHeader(this.tableHeader);

    let rowCounter = 0;
    let tableRowsHtml = '<div class="jstable-body">';
    for (let record of json) {
      tableRowsHtml += this.renderRecord(record, rowCounter, this.tableHeader);
      rowCounter++;
    }
    tableRowsHtml += '</div>';

    this.htmlElement.innerHTML = headerHtml + tableRowsHtml;
  }

  renderHeader(tableHeader) {
    let headerHtml = '<div class="jstable-row header">';
    headerHtml += '<div class="jstable-row-field counter"><span> </span></div>';

    for (let fieldName in tableHeader) {
      let fieldMetadata = tableHeader[fieldName];
      headerHtml += `<div class="jstable-row-field"><span> ${fieldMetadata.title} </span></div>`;
    }

    headerHtml += '</div>';
    return headerHtml;

    /*return `
      <div class="jstable-row header">
        <div class="jstable-row-field counter"><span> </span></div>
        <div class="jstable-row-field right"><span> ${tableHeader.id} </span></div>
        <div class="jstable-row-field"><span> ${tableHeader.title} </span></div>
        <div class="jstable-row-field"><span> ${tableHeader.description} </span></div>
        <div class="jstable-row-field"><span> ${tableHeader.image_src} </span></div>
        <div class="jstable-row-field"><span> ${tableHeader.author} </span></div>
        <div class="jstable-row-field"><span> ${tableHeader.updated_at} </span></div>
      </div>
    `;*/
  }

  renderRecord(record, rowCounter, tableHeader) {
    let rowHtml = '<div class="jstable-row">';

    rowHtml += `<div class="jstable-row-field counter right">
          <span class="label"> </span>
          <span class="text"> ${rowCounter + 1} </span>
        </div>`;

    for (let fieldName in tableHeader) {
      const fieldMetadata = tableHeader[fieldName];
      
      let align = fieldMetadata.align;
      if (!align) {
        align = 'left';
      }

      let valueHtml = '';

      if (fieldMetadata.type === 'image') {
        valueHtml = `<img src="${record[fieldName]}" alt="image"/>`;

      } else {
        valueHtml = record[fieldName];
      }

      rowHtml += `<div class="jstable-row-field ${align}">
          <span class="label"> ${fieldMetadata.title} </span>
          <span class="text"> ${valueHtml} </span>
        </div>`;
    }
  
    rowHtml += '</div>';
    return rowHtml;

    /*return `
      <div class="jstable-row">
        <div class="jstable-row-field counter right">
          <span class="label"> </span>
          <span class="text"> ${rowCounter + 1} </span>
        </div>
        <div class="jstable-row-field right">
          <span class="label"> ${tableHeader.id} </span>
          <span class="text"> ${record.id} </span>
        </div>
        <div class="jstable-row-field">
          <span class="label"> ${tableHeader.title} </span>
          <span class="text"> ${record.title} </span>
        </div>
        <div class="jstable-row-field">
          <span class="label"> ${tableHeader.description} </span>
          <span class="text"> ${record.description} </span>
        </div>
        <div class="jstable-row-field image">
          <span class="label"> ${tableHeader.image_src} </span>
          <span class="text">
            <img src="${record.image_src}" alt="image"/>
          </span>
        </div>
        <div class="jstable-row-field">
          <span class="label"> ${tableHeader.author} </span>
          <span class="text"> ${record.author} </span>
        </div>
        <div class="jstable-row-field">
          <span class="label"> ${tableHeader.updated_at} </span>
          <span class="text"> ${record.updated_at} </span>
        </div>
      </div>
    `;*/
  }

  getScrollbarWidth(element) {
    // The total width of the element including the scrollbar
    const totalWidth = element.offsetWidth;
    // The width of the element without the scrollbar
    const clientWidth = element.clientWidth;
    // The scrollbar width is the difference
    return totalWidth - clientWidth;
  }
}