const setCookie = (name: string, value: string, hours: number) => {
    const expires = new Date(Date.now() + hours * 3600000).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
};

const getCookie = (name: string) => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '');
};

const deleteCookie = (name: string) => {
    setCookie(name, '', -1);
};

export {setCookie, getCookie, deleteCookie};