import type { ReactNode } from 'react';
import { Marquee } from '@/components/magicui/marquee';

export default function TrustedBy() {
    const logos: Array<{ id: string; node: ReactNode }> = [
        {
            id: 'acme',
            node: (
                <svg
            className="h-8 w-auto text-white"
            viewBox="0 0 148 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16.9744 45.4194L0 2.58064H8.73031L16.9744 26.2903L25.2184 2.58064H33.9488L16.9744 45.4194Z"
                fill="currentColor"
            />
            <path
                d="M47.7818 36.3225L57.5122 11.6775H47.7818L38.0515 36.3225H47.7818ZM43.9113 45.4194H35.181L48.8111 2.58064H57.5415L71.1716 45.4194H62.4412L61.0261 40.8387H45.3678L43.9113 45.4194Z"
                fill="currentColor"
            />
            <path
                d="M85.7482 45.4194C79.4365 45.4194 74.3402 39.8064 74.3402 33.1613V15.0645C74.3402 8.35483 79.4365 2.58064 85.7482 2.58064H103.111V10.258H85.7482C84.3857 10.258 83.0515 11.4516 83.0515 15.0645V32.9355C83.0515 36.5484 84.3857 37.7419 85.7482 37.7419H103.111V45.4194H85.7482Z"
                fill="currentColor"
            />
            <path
                d="M129.569 45.4194V16.8064L121.785 45.4194H114.398L106.615 16.8064V45.4194H98.3711V2.58064H110.15L118.092 31.9355L126.033 2.58064H137.813V45.4194H129.569Z"
                fill="currentColor"
            />
                </svg>
            ),
        },
        {
            id: 'globex',
            node: (
                <svg
            className="h-7 w-auto text-white"
            viewBox="0 0 148 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20.5 40.5C9.178 40.5 0 31.322 0 20C0 8.678 9.178 -0.5 20.5 -0.5C26.046 -0.5 31.332 1.638 35.396 5.566L29.972 11.206C27.426 8.844 24.12 7.422 20.5 7.422C13.596 7.422 7.922 13.096 7.922 20C7.922 26.904 13.596 32.578 20.5 32.578C23.958 32.578 27.23 31.182 29.626 28.718V24.08H20.428V16.938H37.814V29.8C33.454 36.43 27.18 40.5 20.5 40.5Z"
                fill="currentColor"
            />
            <path
                d="M50.4048 40.5H42.4828V0.5H50.4048V32.578H62.9108V40.5H50.4048Z"
                fill="currentColor"
            />
            <path
                d="M83.8344 40.5C72.8344 40.5 65.3464 31.42 65.3464 20.252C65.3464 9.084 72.8344 -0.00399876 83.8344 -0.00399876C94.8344 -0.00399876 102.322 9.084 102.322 20.252C102.322 31.43 94.8344 40.5 83.8344 40.5ZM83.8344 32.748C89.9664 32.748 94.2704 27.234 94.2704 20.252C94.2704 13.27 89.9664 7.748 83.8344 7.748C77.7024 7.748 73.3984 13.27 73.3984 20.252C73.3984 27.234 77.7024 32.748 83.8344 32.748Z"
                fill="currentColor"
            />
            <path
                d="M109.816 40.5H108.308V0.5H122.256C129.47 0.5 133.568 4.298 133.568 9.948C133.568 13.388 131.956 16.486 128.42 17.848V18.106C132.886 19.38 135.252 23.364 135.252 27.606C135.252 35.158 129.5 40.5 120.48 40.5H109.816ZM117.882 17.066H120.932C124.238 17.066 125.792 14.864 125.792 11.238C125.792 8.328 124.032 6.84 120.662 6.84H117.882V17.066ZM117.882 34.16H121.218C125.336 34.16 127.136 31.758 127.136 27.658C127.136 23.518 125.266 21.096 121.1 21.096H117.882V34.16Z"
                fill="currentColor"
            />
                </svg>
            ),
        },
        {
            id: 'soylent',
            node: (
                <svg
            className="h-6 w-auto text-white"
            viewBox="0 0 134 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.424 0.959999C20.416 0.959999 23.968 3.52 25.888 7.36L19.232 10.88C18.464 9.152 17.376 8.384 15.36 8.384C12.48 8.384 10.688 10.496 10.688 13.184C10.688 15.68 11.776 16.64 15.552 17.536L18.688 18.304C24.896 19.776 27.52 23.232 27.52 27.52C27.52 33.728 22.528 36.8 16.128 36.8C10.176 36.8 5.76 33.984 3.776 29.568L10.368 25.728C11.392 27.968 12.928 29.376 16.064 29.376C19.072 29.376 20.48 27.776 20.48 25.664C20.48 23.552 19.328 22.336 15.808 21.504L13.056 20.864C6.592 19.264 3.648 15.936 3.648 11.2C3.648 4.672 8.768 0.959999 15.424 0.959999Z"
                fill="currentColor"
            />
            <path
                d="M43.9579 36.8C37.3659 36.8 32.3739 31.872 32.3739 24.896C32.3739 17.92 37.3659 12.992 43.9579 12.992C50.5499 12.992 55.4779 17.856 55.4779 24.896C55.4779 31.936 50.5499 36.8 43.9579 36.8ZM43.9579 29.952C46.3899 29.952 48.0539 28.032 48.0539 24.896C48.0539 21.76 46.3899 19.84 43.9579 19.84C41.5259 19.84 39.8619 21.76 39.8619 24.896C39.8619 28.032 41.5259 29.952 43.9579 29.952Z"
                fill="currentColor"
            />
            <path
                d="M72.0309 36.416L65.5029 13.376H73.3749L75.6149 22.336C76.1269 24.448 76.5109 26.368 76.8309 28.416H77.0229C77.4069 26.432 77.9189 24.512 78.4949 22.272L81.1829 13.376H89.0549L80.6069 41.6L79.0069 47.936H71.3909L72.0309 36.416Z"
                fill="currentColor"
            />
            <path
                d="M96.0628 36.416V13.376H103.359V36.416H96.0628Z"
                fill="currentColor"
            />
            <path
                d="M129.294 20.224H116.366V29.568H130.638V36.416H109.07V13.376H129.998V20.224H129.294Z"
                fill="currentColor"
            />
                </svg>
            ),
        },
        {
            id: 'initech',
            node: (
                <svg
            className="h-7 w-auto text-white"
            viewBox="0 0 119 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3.2 0.799999H10.8V31.2H3.2V0.799999Z"
                fill="currentColor"
            />
            <path
                d="M19.73 31.2V0.799999H27.978L36.01 16.48C37.33 19.06 38.074 21.364 39.106 23.632H39.298C39.034 21.052 38.794 18.064 38.794 15.328V0.799999H45.874V31.2H38.074L29.674 15.016C28.474 12.688 27.538 10.456 26.506 7.936H26.314C26.554 10.552 26.818 13.528 26.818 16.288V31.2H19.73Z"
                fill="currentColor"
            />
            <path
                d="M55.8055 31.2V0.799999H63.4055V31.2H55.8055Z"
                fill="currentColor"
            />
            <path
                d="M79.5215 8.192V31.2H71.9215V8.192H64.9135V0.799999H96.5295V8.192H79.5215Z"
                fill="currentColor"
            />
            <path
                d="M118.802 23.808V31.2H97.7781V0.799999H118.154V8.192H105.378V12.152H115.91V19.04H105.378V23.808H118.802Z"
                fill="currentColor"
            />
                </svg>
            ),
        },
    ];

    return (
        <section
            id="trusted-by"
            className="border-y border-white/5 bg-white/[0.02] py-12"
        >
            <div className="mx-auto max-w-6xl px-6 text-center">
                <p className="mb-8 text-sm font-medium tracking-widest text-slate-500 uppercase">
                    Impulsionando equipes de engenharia em
                </p>

                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0D13] to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0B0D13] to-transparent" />

                    <div className="opacity-40 grayscale transition-all duration-500 hover:grayscale-0">
                        <Marquee className="[--duration:28s]">
                            {logos.map(({ id, node }) => (
                                <div
                                    key={id}
                                    className="mx-8 flex items-center justify-center"
                                >
                                    {node}
                                </div>
                            ))}
                        </Marquee>
                        <Marquee
                            className="[--duration:34s]"
                            reverse
                            pauseOnHover
                        >
                            {logos.map(({ id, node }) => (
                                <div
                                    key={id + '-2'}
                                    className="mx-8 flex items-center justify-center opacity-80"
                                >
                                    {node}
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </div>
            </div>
        </section>
    );
}
