import axios from axios;
import FormData from 'form-data';
import { toast } from 'react-toastify';

const key = process.env.NEXT_PUBLIC_REPLICATE_KEY;

//todo add better metadata and toasts

export const maiaCreate = async(nftPrompt) => {
    const url = `https://api.replicate.com/v1/predictions`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSONBody, {
            headers: {
                Authorization: `Token ${key}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                // Pinned to a specific version of stable diffusion, fetched from:
                // https://replicate.com/kuprel/min-dalle/versions
                // Test with image generation first then video
                version:
                  "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef",
                input: { prompt: nftPrompt.toString() , width: 512, height:512 },
              }),
        })
        .then(function (response) {
            toast.success("MAIA has created your NFT")
            console.log(response)
           return {
               success: true,
               imgURL: response.output[0]
           };
        })
        .catch(function (error) {
            toast.error(error)
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};
