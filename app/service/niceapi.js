import axios from "axios";

async function useAxios(base, destination) {
    const result = await axios.get(
        `https://web.nicepay.co.kr/v3/webstd/js/nicepay-3.0.js`
    );
}