import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import {
    Tab,
    initTE,
  } from "tw-elements";
const propTypes = {
    rank: PropTypes.string,
    martialArt: PropTypes.string,
    promotedDate: PropTypes.string,
}

const defaultProps = {
    rank: 'White Belt',
    martialArt: 'Jiu Jitsu',
    promotedDate: '01/01/2021',
}

const InstructorMartialArts = ({
    rank,
    martialArt,
    promotedDate,
    ...props
}) => {
    useEffect(() => {
        initTE({ Tab });
    })();


    return (
        <div>
            <ul
                class="mb-5 flex list-none flex-col flex-wrap pl-0 md:flex-row"
                id="pills-tab"
                role="tablist"
                data-te-nav-ref>
                <li role="presentation">
                    <a
                        href="#pills-home"
                        class="my-2 block rounded bg-neutral-100 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 data-[te-nav-active]:!bg-primary-100 data-[te-nav-active]:text-primary-700 dark:bg-neutral-700 dark:text-white dark:data-[te-nav-active]:text-primary-700 md:mr-4"
                        id="pills-home-tab"
                        data-te-toggle="pill"
                        data-te-target="#pills-home"
                        data-te-nav-active
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                    >Home</a
                    >
                </li>
                <li role="presentation">
                    <a
                        href="#pills-profile"
                        class="my-2 block rounded bg-neutral-100 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 data-[te-nav-active]:!bg-primary-100 data-[te-nav-active]:text-primary-700 dark:bg-neutral-700 dark:text-white dark:data-[te-nav-active]:text-primary-700 md:mr-4"
                        id="pills-profile-tab"
                        data-te-toggle="pill"
                        data-te-target="#pills-profile"
                        role="tab"
                        aria-controls="pills-profile"
                        aria-selected="false"
                    >Profile</a
                    >
                </li>
                <li role="presentation">
                    <a
                        href="#pills-contact"
                        class="my-2 block rounded bg-neutral-100 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 data-[te-nav-active]:!bg-primary-100 data-[te-nav-active]:text-primary-700 dark:bg-neutral-700 dark:text-white dark:data-[te-nav-active]:text-primary-700 md:mr-4"
                        id="pills-contact-tab"
                        data-te-toggle="pill"
                        data-te-target="#pills-contact"
                        role="tab"
                        aria-controls="pills-contact"
                        aria-selected="false"
                    >Contact</a
                    >
                </li>
                <li role="presentation">
                    <a
                        href="#pills-disabled"
                        class="pointer-events-none my-2 block rounded bg-neutral-200 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-400 dark:bg-neutral-600 dark:text-neutral-500"
                        id="pills-disabled-tab"
                        data-te-toggle="pill"
                        data-te-target="#pills-disabled"
                        role="tab"
                        aria-controls="pills-disabled"
                        aria-selected="false"
                    >Disabled</a
                    >
                </li>
            </ul>

            <div class="mb-6">
                <div
                    class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    data-te-tab-active>
                    Tab 1 content
                </div>
                <div
                    class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="pills-profile"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab">
                    Tab 2 content
                </div>
                <div
                    class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="pills-contact"
                    role="tabpanel"
                    aria-labelledby="pills-contact-tab">
                    Tab 3 content
                </div>
                <div
                    class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                    id="pills-disabled"
                    role="tabpanel"
                    aria-labelledby="pills-disabled-tab">
                    Tab 4 disabled
                </div>
            </div>
        </div>
    );
}

export default InstructorMartialArts;
