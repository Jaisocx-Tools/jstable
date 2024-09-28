class JSTable {
  constructor() {
    this.MAX_WIDTH_MOBILE_LOOK_AND_FEEL = 830;

    this.htmlElementId = '';
    this.metadataUrl = '';
    this.dataUrl = '';

    this.tableMetadata = null;
    this.loadedTableData = null;
    this.tableData = null;

    this.htmlElement = null;

    this.debug = true;

    this.orderByField = '';
    this.orderByOrder = 'ASC';
  }

  setElementId(id) {
    this.htmlElementId = id;
    this.htmlElement = document.getElementById(this.htmlElementId);
    this.assignEventsHandlers();

    return this;
  }

  setMetadataUrl(url) {
    this.metadataUrl = url;
    return this;
  }

  setDataUrl(url) {
    this.dataUrl = url;
    return this;
  }

  setMobileLookAndFeelMaxWidth(width) {
    this.MAX_WIDTH_MOBILE_LOOK_AND_FEEL = width;
    return this;
  }

  assignEventsHandlers() {
    window.addEventListener('resize', () => {
      this.applyColumnsWidths();
      this.adjustHeaderPaddingRight();
    });

    this.htmlElement.addEventListener('click', event => {
      const elem = event.target;
      const parentRowLabel = elem.closest('.jstable-row-field');
      if (!parentRowLabel || !elem.classList.contains('label')) {
        return;
      }

      event.preventDefault();

      this.orderByToggle(elem.dataset.fieldname);
    });
  }

  load() {
    fetch(this.metadataUrl)
      .then(responseMetadata => responseMetadata.json())
      .then(tableMetadata => {
        this.tableMetadata = tableMetadata;
        return fetch(this.dataUrl);
      })
      .then(responseTableData => responseTableData.json())
      .then(
        tableDataJson => {
          this.loadedTableData = tableDataJson;
          this.tableData = [...tableDataJson];
          this.renderTableAndAdjustSizes();
        }
      );
  }

  renderTableAndAdjustSizes() {
    this.renderTable();
    this.applyColumnsWidths();
    this.adjustHeaderPaddingRight();
  }

  renderTable() {
    this.htmlElement.innerHTML = '';

    let headerHtml = this.renderHeader();

    let rowCounter = 0;
    let tableRowsHtml = '<div class="jstable-body">';
    for (let record of this.tableData) {
      tableRowsHtml += this.renderRecord(record, rowCounter);
      rowCounter++;
    }
    tableRowsHtml += '</div>';

    this.htmlElement.innerHTML = headerHtml + tableRowsHtml;

    this.addEventListenersOrderBy();
  }

  addEventListenersOrderBy() {
    const tableHeaderCells = document.querySelectorAll(`#${this.htmlElementId} .jstable-row.header .jstable-row-field`);
    tableHeaderCells
      .forEach(cell => {
        cell.addEventListener('click', () => {
          this.orderByToggle(cell.dataset.fieldname);
        });
      });
  }

  renderHeader() {
    let headerHtml = '<div class="jstable-row header">';
    headerHtml += '<div class="jstable-row-field counter"><span> </span></div>';

    for (let fieldName in this.tableMetadata) {
      let fieldMetadata = this.tableMetadata[fieldName];
      headerHtml += `<div class="jstable-row-field" data-fieldname="${fieldName}"><span> ${fieldMetadata.title} </span></div>`;
    }

    headerHtml += '</div>';
    return headerHtml;
  }

  renderRecord(record, rowCounter) {
    let rowHtml = '<div class="jstable-row">';

    rowHtml += `<div class="jstable-row-field counter right">
          <span class="label"> </span>
          <span class="text"> ${rowCounter + 1} </span>
        </div>`;

    for (let fieldName in this.tableMetadata) {
      const fieldMetadata = this.tableMetadata[fieldName];
      
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
          <span class="label" data-fieldname="${fieldName}"> ${fieldMetadata.title} </span>
          <span class="text"> ${valueHtml} </span>
        </div>`;
    }
  
    rowHtml += '</div>';
    return rowHtml;
  }

  applyColumnsWidths() {
    let gridTemplateColumnsValue = '100%';

    if (!window.matchMedia(`(max-width: ${this.MAX_WIDTH_MOBILE_LOOK_AND_FEEL}px)`).matches) {
      gridTemplateColumnsValue = this.generateGridTemplateColumnsStyle(this.tableMetadata);
    }

    let width = this.htmlElement.clientWidth;
    width = Math.min(document.body.clientWidth, width);

    const mediaStylesheetLittle = document.getElementById('jstableStylesheetLittle');

    if (width > this.MAX_WIDTH_MOBILE_LOOK_AND_FEEL) {
      gridTemplateColumnsValue = this.generateGridTemplateColumnsStyle(this.tableMetadata);
      mediaStylesheetLittle.disabled = true;
    } else {
      mediaStylesheetLittle.disabled = false;
    }

    const tableHeadHtmlElement = document.querySelector(`#${this.htmlElementId} .jstable-row.header`);
    tableHeadHtmlElement.style.gridTemplateColumns = gridTemplateColumnsValue;

    const tableRowsHtmlElementsCollection = document.querySelectorAll(`#${this.htmlElementId} .jstable-body .jstable-row`);
    let rowHtmlElement = null;
    for (let i=0; i < tableRowsHtmlElementsCollection.length; i++) {
      rowHtmlElement = tableRowsHtmlElementsCollection.item(i);
      rowHtmlElement.style.gridTemplateColumns = gridTemplateColumnsValue;
    }
  }

  generateGridTemplateColumnsStyle() {
    let gridTemplateColumns = '3rem ';

    for (let fieldName in this.tableMetadata) {
      let fieldMetadata = this.tableMetadata[fieldName];
      gridTemplateColumns += fieldMetadata.width + ' ';
    }

    return gridTemplateColumns;
  }

  adjustHeaderPaddingRight() {
    const tableBody = document.querySelector('#' + this.htmlElementId + ' .jstable-body');
    const scrollbarWidth = this.getScrollbarWidth(tableBody);
    const rowHeader = document.querySelector('#' + this.htmlElementId + ' .jstable-row.header');
    rowHeader.style.paddingRight = scrollbarWidth + 'px';
  }

  getScrollbarWidth(element) {
    // The total width of the element including the scrollbar
    const totalWidth = element.offsetWidth;
    // The width of the element without the scrollbar
    const clientWidth = element.clientWidth;
    // The scrollbar width is the difference
    return totalWidth - clientWidth;
  }

  orderByToggle(field) {
    let order = 'ASC';
    if (this.orderByField === field) {
      order = (this.orderByOrder === 'ASC') ? 'DESC' : 'ASC';
    }
    this.orderBy(field, order);
  }

  orderBy(field, order) {
    if (!field) {
      return;
    }

    this.orderByField = field;
    this.orderByOrder = order;

    const numOrder = (order === 'ASC') ? 1 : (-1);

    this.tableData = [
      ...this.loadedTableData
        .sort((a, b) => {
          const fieldValueA = a[field];
          const fieldValueB = b[field];
          if (fieldValueA > fieldValueB) {
            return numOrder;
          } else if (fieldValueA < fieldValueB) {
            return -numOrder;
          } else {
            return 0;
          }
        })
    ];

    this.renderTableAndAdjustSizes();
  }
}

