import React from "react";

type Props = {
  slide: string;
  colors: any;
};

const HTML_DEFAULT = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Slider Frame</title>
        <script src="https://cdn.tailwindcss.com"></script>

        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {colorCodes},
                        backgroundImage: {
                            gradient: 'linear-gradient(90deg, #6366F1, 0%, #108981 100%)'
                        }
                    },
                },
            };
        </script>

        <!-- Flowbite CSS & JS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

        <!-- Font Awesome Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

        <!-- Chart.js for charts & graphs -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <!-- ADS (Animate On Scroll) for scroll animations -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
       
        <!-- GSAP (GreenSock) for advanced animations -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

        <!-- Lottie for JSON based animations -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

        <!-- Swiper.js for sliders/carousels -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

        <!-- Optional: Tooltip & Popover library (Tippy.js) -->
        <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
        <script src="https://unpkg.com/@popperjs/core@2"></script>
        <script src="https://unpkg.com/tippy.js@6"></script>
    </head>
    {code}
    </html>
`;

const SliderFrame = (props: Props) => {
  return <div>SliderFrame</div>;
};

export default SliderFrame;
