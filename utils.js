function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}


function treeToHTML(rootNode) {
  if (typeof document === 'undefined') return;

  // Initialize the root.
  let root;
  if (!rootNode?.tag) {
    if (!rootNode?.htmlString) {
      return;
    }
    root = createElementFromHTML(rootNode.htmlString);
  } else {
    root = document.createElement(rootNode.tag);
  }

  if (rootNode.id) root.id = rootNode.id;
  if (rootNode.class) root.classList.add(...rootNode.class.split(/\s+/));
  if (rootNode.attrs) Object.entries(rootNode.attrs).forEach(([name, value]) => {
    root.setAttribute(name, value);
  });
  if (rootNode.innerText) root.innerText = rootNode.innerText;
  if (rootNode.innerHTML) root.innerHTML = rootNode.innerHTML;
  if (rootNode.childElements) {
    rootNode.childElements.forEach(childNode => {
      root.appendChild(treeToHTML(childNode));
    });
  }

  return root;
}


function htmlToTree(node) {

  if (!node?.outerHTML && !node?.textContent?.trim()) return;

  const tree = {};

  if (node.id) tree.id = node.id;

  if (node.className) tree.class = node.className;

  if (node.attributes) {
    let attrs = {};
    for (let attr of node.attributes) {
      const name = attr.name.toLowerCase();
      const value = attr.value;
      if (name !== 'class' && name !== 'id') {
        attrs[attr.name] = attr.value;
      }
    }
    if (Object.keys(attrs).length !== 0) tree.attrs = attrs;
  }

  if (node.tagName) {
    tree.tag = node.tagName.toLowerCase();

    if (tree.tag === 'style') {
      tree.htmlString = node.textContent.trim();
      return tree;  
    }
  } else {
    tree.htmlString = node.textContent.trim();
    return tree;
  }

  if (node.childNodes.length !== 0) {
    if (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
      tree.innerText = node.childNodes[0].textContent.trim();
    } else {
      const childElements = Array.from(node.childNodes).map(node => htmlToTree(node)).filter(x => x);
      if (childElements.length !== 0) {
        tree.childElements = childElements;
      }
    }
  }

  return tree;
}


function createCustomElement(elementName, contents, style=null, layout=null) {

  class WrapperClass {
    static elementClass = null;

    static contents = contents;
    static style = style;
    static layout = layout;

    constructor() {}
  };

  const newCustomElement = class extends HTMLElement {

    constructor() {
      super();
    }

    connectedCallback() {
      this.attachShadow({ mode: 'open' });

      // // Test shadow internal script.
      // const internalScript = document.createElement('script');
      // internalScript.innerHTML = ``;
      // this.shadowRoot.appendChild(internalScript);

      // if (WrapperClass.style) {
      //   const internalStyle = document.createElement('style');
      //   internalStyle.innerHTML = WrapperClass.style.map(ruleset => {
      //     const selectorList = ruleset.selector;
      //     const declarationBlock = Object.entries(ruleset.declarations).map(([attribute, value]) => {
      //       return `${attribute}: ${value};`;
      //     }).join('\n');
      //     return `${selectorList} {${declarationBlock}}`;
      //   }).join('\n');
      //   this.shadowRoot.appendChild(internalStyle);
      // }

      WrapperClass.contents.forEach(node => {
        if (node instanceof HTMLElement) {
          this.shadowRoot.append(node.cloneNode(true));
        } else {
          this.shadowRoot.append(treeToHTML(node));
        }

      });
    }
  };


  try {
    customElements.define(elementName, newCustomElement);
  } catch (error) {
    return null;
  }

  WrapperClass.elementClass = newCustomElement;
  return WrapperClass;
}
