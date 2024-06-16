class PuppeteerHelper {
    static getInstance() {
        if (!(PuppeteerHelper.helper)) {
            PuppeteerHelper.helper = new PuppeteerHelper();
        }

        return PuppeteerHelper.helper;
    }

    constructor() {
    }

    /**
     * @param {Browser} browser
     * @return {Promise<{Page}>}
     */
    async getOrCreateFirstPage(browser) {
        let pages = await browser.pages();
        if (pages && pages.length > 0) {
            return (await browser.pages())[0]
        } else {
            return await browser.newPage();
        }
    }

    /**
     * @param {Page} page
     * @return {Promise<void>}
     */
    async disableVirtualViewPort(page) {
    }

    getProxyArg(proxy) {
        return `--proxy-server=${proxy}`;
    }

    /**
     * Build css selector for element
     *
     * @param {Page} page - puppeteer page
     * @param element - puppeteer element
     * @param idsExclude - exclude elements
     * @returns {Promise.<*>}
     */
    async getCSSPathTo(page, element, idsExclude) {
        if (!!page && !!element) {
            return await page.evaluate((element, idsExclude) => {
                function arrayContains(needle, array) {
                    if (!array) return false;
                    return (array.indexOf(needle) > -1);
                }

                function validId(id) {
                    return !arrayContains(':', id);
                }

                var cssPath = function (el) {
                    if (!(el instanceof Element)) return;
                    var path = [];
                    while (el.nodeType === Node.ELEMENT_NODE) {
                        var selector = el.nodeName.toLowerCase();
                        if (el.id && !arrayContains(el.id, idsExclude) && validId(el.id)) {
                            selector += '#' + el.id;
                        } else {
                            var sib = el, nth = 1;
                            while (sib.nodeType === Node.ELEMENT_NODE && (sib = sib.previousSibling) && nth++) ;
                            selector += ":nth-child(" + nth + ")";
                        }
                        path.unshift(selector);
                        el = el.parentNode;
                    }
                    return path.join(" > ");
                };

                return cssPath(element);
            }, element, idsExclude);
        }

        return null;
    }

    /**
     * JS Click to element
     *
     * @param {Page} page - puppeteer page
     * @param element - puppeteer element
     * @return {Promise<void>}
     */
    async jsClickByElement(page, element) {
        await page.evaluate(el => {
            try {
                el.scrollIntoView({block: "center"});
                el.focus();
            } catch (error) {
                throw error;
            }

            try {
                el.click();
            } catch (error) {
                throw error;
            }
        }, element);
    }

    /**
     * JS Click by selector
     *
     * @param {Page} page - puppeteer page
     * @param selector - selector
     * @return {Promise<void>}
     */
    async jsClickBySelector(page, selector) {
        await page.evaluate(selector => {
            try {
                document.querySelector(selector).scrollIntoView({block: "center"});
                document.querySelector(selector).focus();
            } catch (error) {
                throw error;
            }

            try {
                document.querySelector(selector).click();
            } catch (error) {
                throw error;
            }
        }, selector);
    }
}

module.exports = PuppeteerHelper.getInstance();
