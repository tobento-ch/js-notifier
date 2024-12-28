const notifier = (function(window, document) {
    'use strict';
    
    let idCounter = 0;

    function uniqueId(prefix) {
        const id = ++idCounter + '';
        return prefix ? prefix + id : id;
    }

    function hasObjKey(obj, key) {
        if (obj === undefined) { return false; }
        return (typeof obj[key] === 'undefined') ? false : true;
    }
    
    function getData(obj, key, defaultValue = null) {
        if (typeof key === 'string') {
            return getData(obj, key.split('.'), defaultValue);
        } else if (key.length === 0) {
            return obj;
        } else {
            if (typeof obj === 'undefined') { return defaultValue;}
            if (obj == null) { return defaultValue;}
            if (typeof obj[key[0]] === 'undefined') { return defaultValue;}
            return getData(obj[key[0]], key.slice(1), defaultValue);
        }
    }

    function createElement(item) {
        if (!hasObjKey(item, 'element')) {
            item.element = 'div';
        }

        const el = document.createElement(item.element);

        if (hasObjKey(item, 'text')) {
            el.textContent = item.text;
        }
        if (hasObjKey(item, 'html')) {
            el.innerHTML = item.html;
        }
        if (hasObjKey(item, 'classes')) {
            el.classList.add(...item.classes);
        }
        if (hasObjKey(item, 'attributes')) {
            for (const name in item.attributes) {
                el.setAttribute(name, item.attributes[name]);
            }
        }

        return el;
    }
    
    class Notification {
        constructor(config) {
            this.id = config.id;
            this.config = config;
            
            if (this.getConfig('title', '') === '' && this.getConfig('text', '') === '') {
                return;
            }
            
            this.el = createElement({classes: this.getConfig('classes', ['notification', 'notification-fade'])});
            this.bodyEl = createElement({classes: ['notification-body']});
            
            const status = this.getConfig('status');
            
            if (status) {
                this.el.classList.add(status);
            }
            
            this.applyIcon();
            this.applyContent();
            this.applyAction();
            this.applyProgressBar();
            this.applyCloseBtn();
            this.pushToStack();
            this.show();
        }
        applyIcon() {
            if (! this.getConfig('showIcon', true)) {
                return;
            }
            
            const svg = this.getConfig('icon', this.getSvgIcon(this.getConfig('status', '')));

            if (svg === '') {
                return;
            }
            
            const iconEl = createElement({html: svg, classes: ['notification-icon']});
            this.el.appendChild(iconEl);
        }
        getSvgIcon(name) {
            return getData(notifier.icons, name, '');
        }
        applyContent() {
            if (this.getConfig('title', '') !== '') {
                const titleEl = createElement({text: this.getConfig('title', ''), classes: ['notification-title']});
                this.bodyEl.appendChild(titleEl);
            }
            if (this.getConfig('text', '') !== '') {
                const textEl = createElement({text: this.getConfig('text', ''), classes: ['notification-text']});
                this.bodyEl.appendChild(textEl);
            }
            
            this.el.appendChild(this.bodyEl);
        }
        applyAction() {
            const action = this.getConfig('action');
            
            if (action === null) {
                return;
            }
            
            const actionEl = createElement({classes: ['notification-action']});
            const el = createElement({
                element: 'a',
                text: getData(action, 'title', ''),
                classes: getData(action, 'classes', []),
                attributes: {href: getData(action, 'url', '')}
            });
            
            actionEl.appendChild(el);
            this.bodyEl.appendChild(actionEl);
        }
        applyProgressBar() {
            if (!this.hasConfig('autotimeout')) {
                this.config.autotimeout = 5000;
            }
            
            if (this.getConfig('autotimeout') <= 0) {
                return;
            }
            
            const timeout = this.getConfig('autotimeout', 5000);
            const progressbarEl = createElement({classes: ['notification-progressbar']});
            const progressEl = createElement({classes: ['notification-progress']});
            
            progressEl.style.animationDuration = timeout+'ms';
            progressbarEl.appendChild(progressEl);
            progressEl.style.animationPlayState = 'running';
            this.el.appendChild(progressbarEl);
            this.close(timeout);
        }
        applyCloseBtn() {
            if (! this.getConfig('showCloseButton', true)) {
                return;    
            }
            
            const closeEl = createElement({html: this.getSvgIcon('close'), classes: ['notification-close']});
            this.el.appendChild(closeEl);
            
            closeEl.addEventListener('click', (e) => {
                this.close();
            });
        }
        hasConfig(key) {
            return hasObjKey(this.config, key);
        }
        getConfig(key, defaultValue = null) {
            return getData(this.config, key, defaultValue);
        }
        show() {
            setTimeout(() => {
              this.el.classList.add('active');
            }, 50);
        }
        close(delay = 60) {
            setTimeout(() => {
                this.el.classList.remove('active');
                this.remove();
            }, delay);
        }
        remove() {
            setTimeout(() => {
                this.el.remove();
                notifier.delete(this.id);
            }, this.getConfig('removeDelay', 500));
        }
        pushToStack() {
            notifier.getStack(this.getConfig('stack', 'default')).push(this);
        }
    }
    
    class Stack {
        constructor(id) {
            this.id = id;
            this.el = this.create();
            
            document.body.appendChild(this.el);
        }
        push(notification) {
            if (this.el.hasChildNodes()) {
                this.el.insertBefore(notification.el, this.el.firstChild);
            } else {
                this.el.appendChild(notification.el);
            }
        }
        create() {
            return createElement({
                classes: ['notification-stack-'+this.id]
            });
        }
    }

    const notifier = {
        notifications: {},
        stacks: {},
        icons: {
            success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>',
            error: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l6 0" /></svg>',
            warning: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>',
            info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>',
            close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>'
        },
        set: function(id, obj) {
            this.notifications[id] = obj;
            return obj;
        },
        get: function(id) {
            return this.notifications[id];
        },
        delete: function(id) {
            delete this.notifications[id];
        },
        has: function(id) {
            return (typeof this.notifications[id] === 'undefined') ? false : true;
        },
        getStack: function(id) {
            if (typeof this.stacks[id] === 'undefined') {
                return this.stacks[id] = new Stack(id);
            }
            
            return this.stacks[id];
        },
        send: function(notification = {}) {
            if (typeof notification['id'] === 'undefined') {
                notification['id'] = uniqueId();
            }

            return this.set(notification['id'], new Notification(notification));
        }
    };
    
    return notifier;
    
})(window, document);

export default notifier;