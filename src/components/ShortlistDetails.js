import React, { useEffect, useState } from "react";

import { USER, HACKATHONS, IS_DEVELOPMENT } from "../constants";
import {
    Button,
    Card,
    CardBody,
    Typography,
    Progress,
    IconButton,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
} from "@material-tailwind/react";

import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import {
    acceptTeam,
    clearTeams,
    fetchPanelistTeamsByHackathonId,
    rejectTeam,
} from "../features/team/teamSlice";
import { fetchHackathons } from "../features/hackathon/hackathonSlice";
import { selectUserDetails, selectUserToken } from "../features/user/userSlice";
import { toast } from "react-toastify";

const ShortlistDetails = ({ hackathons, selectedIdeaId, IDEAS }) => {
    const dateConverter = (date) => {
        const shortdate = new Date(date).toLocaleString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        const time = new Date(date).toLocaleTimeString("en-GB", {
            hour12: false,
        });

        return `${shortdate}, ${time}`;
    };

    const dispatch = useDispatch();

    // const hackathons = useSelector((state) => state.hackathon.hackathons.data);
    // const user = USER;
    const userData = useSelector(selectUserDetails);
    const token = useSelector(selectUserToken);
    // useSelector((state) => state.user.login?.data?.data);
    // console.log(hackathons);

    // useEffect(() => {
    //     dispatch(fetchHackathons());
    // }, []);

    //use hackathonSlice useSelector to fetch data of assigned hackthon here
    const [selectedHackathon, setSelectedHackathon] = useState(
        hackathons?.find(
            (hackathon) => hackathon.hackathonId === userData?.assignedHackathon
        )
    );

    const [selectedIdea, setSelectedIdea] = useState(
        IDEAS?.find((idea) => idea.teamId === selectedIdeaId)
    );
    // console
    // console.log(selectedIdea);
    // console.log(IDEAS);
    // console.log(selectedIdeaId);

    useEffect(() => {
        // console.log(selectedIdeaId)
        setSelectedIdea(
            IDEAS?.find((idea) => idea?.teamId === selectedIdeaId) || IDEAS[0]
        );
    }, [selectedIdeaId, IDEAS]);

    const [openRules, setOpenRules] = useState(false);

    const handleOpenRules = () => {
        setOpenRules(!openRules);
    };

    const handleIdeaAccept = async () => {
        // console.log(teamId + "idea accepted");
        try {
            await toast.promise(
                dispatch(
                    acceptTeam({
                        teamId: selectedIdea?.teamId,
                        token,
                    })
                ).unwrap(),
                {
                    pending: "Accepting idea...",
                    success: "Idea accepted successfully!",
                    error: {
                        render({ data }) {
                            return `Error: ${data?.message}`;
                        },
                    },
                }
            );
            await dispatch(
                fetchPanelistTeamsByHackathonId({
                    hackathonId: userData?.assignedHackathon,
                    panelistid: userData?.userId,
                    token,
                })
            ).unwrap();
        } catch (error) {
            console.log(error?.message);
        }
    };
    const handleIdeaReject = async (teamId) => {
        // console.log(teamId + "idea rejected");
        try {
            await toast.promise(
                dispatch(
                    rejectTeam({
                        teamId: selectedIdea?.teamId,
                        token,
                    })
                ).unwrap(),
                {
                    pending: "Rejecting idea...",
                    success: "Idea rejected successfully!",
                    error: {
                        render({ data }) {
                            return `Error: ${data?.message}`;
                        },
                    },
                }
            );
            await dispatch(
                fetchPanelistTeamsByHackathonId({
                    hackathonId: userData?.assignedHackathon,
                    panelistid: userData?.userId,
                    token,
                })
            ).unwrap();
        } catch (error) {
            console.log(error?.message);
        }
    };

    const formatSecondsToDDHHMMSS = (s) => {
        const isNegative = s < 0;
        s = Math.abs(s / 1000); // Convert to positive value for calculations

        const days = parseInt(s / (24 * 60 * 60));
        const hours = parseInt((s % (24 * 60 * 60)) / (60 * 60));
        const minutes = parseInt((s % (60 * 60)) / 60);
        const seconds = parseInt(s % 60);

        const components = [days, hours, minutes, seconds].map((num) =>
            String(num).padStart(2, "0")
        );
        let formattedString = components.join(":");

        if (isNegative) {
            formattedString = "-" + formattedString; // Prepend "-" sign if input is negative
        }

        return formattedString;
    };

    const ideaSubmissionDeadline = new Date(
        selectedHackathon.ideaSubmissionDeadline
    );
    const shortListDeadline = new Date(selectedHackathon.shortListDeadline);
    const implementationDeadline = new Date(
        selectedHackathon.implementationDeadline
    );

    const reviewStartTime = new Date(selectedHackathon.reviewStartTime);
    const reviewEndTime = new Date(selectedHackathon.reviewEndTime);

    const ISTOffset = 330; //+5:30hrs

    const [currentDate, setCurrentDate] = useState(
        new Date(
            new Date().getTime() +
                (ISTOffset + new Date().getTimezoneOffset()) * 60000
        )
    );

    const [duringShortlist, setDuringShortlist] = useState(
        currentDate > ideaSubmissionDeadline && currentDate < shortListDeadline
    );
    const [beforeShortlist, setBeforeShortlist] = useState(
        currentDate < ideaSubmissionDeadline
    );
    const [afterShortlist, setAfterShortlist] = useState(
        currentDate > shortListDeadline
    );
    const [percentageElapsed, setPercentageElapsed] = useState(
        100 -
            Math.floor(
                ((shortListDeadline - currentDate) * 100) /
                    (shortListDeadline - ideaSubmissionDeadline)
            )
    );

    const [timeLeft, setTimeLeft] = useState(
        formatSecondsToDDHHMMSS(shortListDeadline - currentDate)
    );

    useEffect(() => {
        const updateCurrentTime = setTimeout(function () {
            setCurrentDate(
                new Date(
                    new Date().getTime() +
                        (ISTOffset + new Date().getTimezoneOffset()) * 60000
                )
            );
            setDuringShortlist(
                currentDate > ideaSubmissionDeadline &&
                    currentDate < shortListDeadline
            );
            setBeforeShortlist(currentDate < ideaSubmissionDeadline);
            setAfterShortlist(currentDate > shortListDeadline);
            setPercentageElapsed(
                100 -
                    Math.floor(
                        ((shortListDeadline - currentDate) * 100) /
                            (shortListDeadline - ideaSubmissionDeadline)
                    )
            );
            setTimeLeft(
                formatSecondsToDDHHMMSS(shortListDeadline - currentDate)
            );
        }, 1000);

        return () => {
            // this should work flawlessly besides some milliseconds lost here and there
            clearTimeout(updateCurrentTime);
        };
    }, [currentDate]);

    useEffect(() => {
        try {
            if (duringShortlist) {
                dispatch(
                    fetchPanelistTeamsByHackathonId({
                        hackathonId: userData?.assignedHackathon,
                        panelistid: userData?.userId,
                        token,
                    })
                );
            }

            if (!duringShortlist) {
                dispatch(clearTeams());
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    }, [duringShortlist]);

    return (
        <>
            {/* {!loading &&  */}
            <div className="md:px-2 w-full">
                {selectedHackathon ? (
                    <Card shadow={false} className="mb-3">
                        <CardBody>
                            <div className="w-full grid md:grid-cols-6">
                                <Typography
                                    className="md:col-span-5 mb-1 px-2 font-semibold flex text-incedo-secondary-600 text-left justify-start"
                                    variant="h2"
                                    // color="black"
                                >
                                    {selectedHackathon?.name || ""}
                                </Typography>
                                <div className="md:col-span-1 py-1 flex items-center justify-end">
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        className="m-1"
                                        onClick={handleOpenRules}
                                    >
                                        Details
                                    </Button>
                                </div>
                            </div>
                            <div className="mb-1 w-full rounded-2xl p-2 py-1 text-incedo-tertiary-900">
                                <Typography variant="h4">
                                    Theme: {selectedHackathon?.theme || ""}
                                </Typography>
                            </div>
                            <div className="w-full px-3">
                                <div className="mb-2 flex items-center justify-between gap-4">
                                    <Typography color="blue-gray" variant="h6">
                                        Shortlist Deadline
                                    </Typography>

                                    {IS_DEVELOPMENT ? (
                                        <Typography color="orange" variant="h6">
                                            Presentation Mode
                                        </Typography>
                                    ) : duringShortlist ? (
                                        <Typography
                                            color="blue-gray"
                                            variant="h6"
                                        >
                                            {timeLeft}
                                        </Typography>
                                    ) : beforeShortlist ? (
                                        <Typography color="red" variant="h6">
                                            {"Shortlist period hasn't started."}
                                        </Typography>
                                    ) : afterShortlist ? (
                                        <Typography color="red" variant="h6">
                                            {"Shortlist period is over."}
                                        </Typography>
                                    ) : null}
                                </div>{" "}
                                {!IS_DEVELOPMENT && duringShortlist ? (
                                    <Progress value={percentageElapsed} />
                                ) : null}
                            </div>
                            {/* <ProgressBar /> */}
                            {/* <div className="w-full px-2">
                                <div className="mb-2 flex items-center justify-between gap-4">
                                    <Typography color="blue-gray" variant="h6">
                                        Shortlist Deadline
                                    </Typography>
                                    <Typography color="blue-gray" variant="h6">
                                        50% Elapsed
                                    </Typography>
                                </div>
                                <Progress value={50} />
                            </div> */}
                        </CardBody>
                    </Card>
                ) : null}

                {IDEAS.length !== 0 && selectedIdeaId ? (
                    <Card
                        shadow={false}
                        className="md:min-h-[52.2vh] md:max-h-[52.2vh] overflow-auto"
                    >
                        <CardBody>
                            <div className="w-full grid md:grid-cols-6">
                                <div className="md:col-span-5 w-full rounded-2xl p-2 py-1 text-incedo-tertiary-900">
                                    <Typography variant="h3">
                                        {selectedIdea?.ideaTitle || ""}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        className=" text-gray-600"
                                    >
                                        {selectedIdea?.ideaDomain || ""}
                                    </Typography>
                                </div>
                                <div className="md:col-span-1 px-2 flex flex-col items-center justify-end">
                                    <Button
                                        onClick={handleIdeaAccept}
                                        disabled={
                                            selectedIdea?.status !== "submitted"
                                        }
                                        className="bg-green-400 mb-2"
                                        size="sm"
                                        fullWidth
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        onClick={handleIdeaReject}
                                        disabled={
                                            selectedIdea?.status !== "submitted"
                                        }
                                        className="bg-red-700"
                                        size="sm"
                                        fullWidth
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full mt-1 rounded-2xl p-2">
                                <Typography className="">
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                selectedIdea?.ideaBody
                                            ),
                                        }}
                                    ></span>
                                </Typography>
                            </div>
                        </CardBody>
                    </Card>
                ) : null}
                <Dialog open={openRules} handler={handleOpenRules}>
                    <DialogHeader>
                        <Typography
                            className=" px-2 font-semibold flex text-incedo-secondary-600 text-left justify-start"
                            variant="h2"
                            // color="black"
                        >
                            {selectedHackathon?.name || ""}
                        </Typography>
                    </DialogHeader>
                    <DialogBody>
                        <div className="overflow-auto  max-h-[60vh]">
                            <div className="w-full mt-1 rounded-2xl p-2">
                                <Typography variant="h4">
                                    Description
                                </Typography>
                                <Typography>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                selectedHackathon?.description
                                            ),
                                        }}
                                    ></span>
                                </Typography>
                            </div>
                            <div className="w-full mt-1 rounded-2xl p-2">
                                <Typography variant="h4">Rules</Typography>
                                <Typography>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                selectedHackathon?.rules
                                            ),
                                        }}
                                    ></span>
                                </Typography>
                            </div>
                            <div className="w-full rounded-2xl p-2">
                                <Typography variant="h4">
                                    Judging Criteria
                                </Typography>
                                <Typography>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                selectedHackathon?.judgingCriteria
                                            ),
                                        }}
                                    ></span>
                                </Typography>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleOpenRules}
                            className="mr-1"
                        >
                            <span>Close</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </div>
            {/* } */}
        </>
    );
};

export default ShortlistDetails;
