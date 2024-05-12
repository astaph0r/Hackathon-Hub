import React, { useEffect, useState } from "react";
import { IS_DEVELOPMENT, USER } from "../constants";
import {
    Button,
    Card,
    CardBody,
    Typography,
    Progress,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    Rating,
    Textarea,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";

import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import {
    clearTeams,
    fetchJudgeTeamsByHackathonId,
    rateTeam,
} from "../features/team/teamSlice";
import { selectUserDetails, selectUserToken } from "../features/user/userSlice";
import { toast } from "react-toastify";

const ReviewDetails = ({ hackathons, selectedIdeaId, IDEAS }) => {
    const dispatch = useDispatch();
    const userData = useSelector(selectUserDetails);
    const token = useSelector(selectUserToken);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const [selectedHackathon, setSelectedHackathon] = useState(
        hackathons?.find(
            (hackathon) => hackathon.hackathonId === userData?.assignedHackathon
        )
    );

    const [selectedIdea, setSelectedIdea] = useState(
        IDEAS?.find((idea) => idea.teamId === selectedIdeaId)
    );

    useEffect(() => {
        setSelectedIdea(
            IDEAS?.find((idea) => idea?.teamId === selectedIdeaId) || IDEAS[0]
        );
    }, [selectedIdeaId, IDEAS]);

    useEffect(() => {
        if (selectedIdea) {
            setReviewSubmitted(
                selectedIdea?.userIds?.filter(
                    (user) => user === userData.userId
                ).length > 0
            );
        }
    }, [selectedIdea]);

    const [openRules, setOpenRules] = useState(false);

    const handleOpenRules = () => {
        setOpenRules(!openRules);
    };
    const [reviewData, setReviewData] = useState({ rating: 0 });

    const handleRating = (rate) => {
        setReviewData({
            ...reviewData,
            rating: rate,
            teamId: selectedIdeaId,
            userId: userData?.userId,
        });
    };

    const handleFeedback = (e) => {
        const { name, value } = e.target;
        setReviewData({ ...reviewData, feedback: value });
    };
    const [validationErrors, setValidationErrors] = useState({});
    const handleReviewSubmit = async () => {
        //dispatch judge review here
        const newErrors = {};
        if (reviewData.rating === 0) {
            newErrors.rating = "Rating is required";
        }
        if (!reviewData.feedback) {
            newErrors.rating = "Feedback is required";
        }
        if (reviewData.feedback && reviewData.feedback.length > 255) {
            newErrors.feedback =
                "Feedback Should Not Contain More Than 255 Characters";
        }
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
        } else {
            try {
                // console.log(reviewData);
                await dispatch(rateTeam({ ...reviewData, token })).unwrap();
                await dispatch(
                    fetchJudgeTeamsByHackathonId({
                        hackathonId: userData?.assignedHackathon,
                        token,
                    })
                ).unwrap();
                setReviewData({});
                setValidationErrors({});
                toast.success("Review submitted succesfully");
            } catch (error) {
                toast.error(`Error ${error?.message}`);
            }
        }
        setValidationErrors(newErrors);
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

    const [duringReview, setDuringReview] = useState(
        currentDate > reviewStartTime && currentDate < reviewEndTime
    );
    const [beforeReview, setBeforeReview] = useState(
        currentDate < reviewStartTime
    );
    const [afterReview, setAfterReview] = useState(
        currentDate > reviewEndTime
    );
    const [percentageElapsed, setPercentageElapsed] = useState(
        100 -
            Math.floor(
                ((reviewEndTime - currentDate) * 100) /
                    (reviewEndTime - reviewStartTime)
            )
    );

    const [timeLeft, setTimeLeft] = useState(
        formatSecondsToDDHHMMSS(reviewEndTime - currentDate)
    );

    useEffect(() => {
        const updateCurrentTime = setTimeout(function () {
            setCurrentDate(
                new Date(
                    new Date().getTime() +
                        (ISTOffset + new Date().getTimezoneOffset()) * 60000
                )
            );
            setDuringReview(
                currentDate > reviewStartTime && currentDate < reviewEndTime
            );
            setBeforeReview(currentDate < reviewStartTime);
            setAfterReview(currentDate > reviewEndTime);
            setPercentageElapsed(
                100 -
                    Math.floor(
                        ((reviewEndTime - currentDate) * 100) /
                            (reviewEndTime - reviewStartTime)
                    )
            );
            setTimeLeft(formatSecondsToDDHHMMSS(reviewEndTime - currentDate));
        }, 1000);

        return () => {
            // this should work flawlessly besides some milliseconds lost here and there
            clearTimeout(updateCurrentTime);
        };
    }, [currentDate]);

    useEffect(() => {
        try {
            if (duringReview) {
                dispatch(
                    fetchJudgeTeamsByHackathonId({
                        hackathonId: userData?.assignedHackathon,
                        token,
                    })
                );
            }

            if (!duringReview) {
                dispatch(clearTeams());
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    }, [duringReview]);

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
                                        Review Deadline
                                    </Typography>

                                    {IS_DEVELOPMENT ? (
                                        <Typography color="orange" variant="h6">
                                            Presentation Mode
                                        </Typography>
                                    ) : duringReview ? (
                                        <Typography
                                            color="blue-gray"
                                            variant="h6"
                                        >
                                            {timeLeft}
                                        </Typography>
                                    ) : beforeReview ? (
                                        <Typography color="red" variant="h6">
                                            {"Review period hasn't started."}
                                        </Typography>
                                    ) : afterReview ? (
                                        <Typography color="red" variant="h6">
                                            {"Review period is over."}
                                        </Typography>
                                    ) : null}
                                </div>{" "}
                                {!IS_DEVELOPMENT && duringReview ? (
                                    <Progress value={percentageElapsed} />
                                ) : null}
                            </div>
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
                            <div className="w-full">
                                <div className=" w-full rounded-2xl p-2 py-1 text-incedo-tertiary-900">
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
                            <div className="flex flex-row p-2 gap-4">
                                <Link
                                    to={selectedIdea?.ideaRepo || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Typography className="underline">
                                        Repo Link
                                    </Typography>
                                </Link>
                                <Link
                                    to={selectedIdea?.ideaFiles || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Typography className="underline">
                                        Files Link
                                    </Typography>
                                </Link>
                            </div>
                            {reviewSubmitted ? (
                                <Typography className="p-2 py-1 text-green-400">
                                    Review Submitted &#10004;
                                </Typography>
                            ) : (
                                <div>
                                    <div className="w-full rounded-2xl flex gap-3 p-2 py-1 items-center">
                                        Rating*:
                                        <Rating
                                            unratedColor="amber"
                                            ratedColor="amber"
                                            value={reviewData?.rating || 0}
                                            onChange={(value) =>
                                                handleRating(value)
                                            }
                                            // readonly=
                                        />
                                        {validationErrors?.rating && (
                                            <Typography className="text-red-500 text-xs w-fit">
                                                {validationErrors.rating}
                                            </Typography>
                                        )}
                                    </div>
                                    <div className="w-full mt-2 rounded-2xl flex gap-3 p-2 py-1 items-center">
                                        <Textarea
                                            // disabled={
                                            // }
                                            label="Feedback*"
                                            name="feedback"
                                            value={reviewData?.feedback || ""}
                                            onChange={handleFeedback}
                                        />
                                        {validationErrors?.feedback && (
                                            <Typography className="text-red-500 text-xs w-fit">
                                                {validationErrors.feedback}
                                            </Typography>
                                        )}
                                    </div>
                                    <div className="flex gap-2 p-2 justify-center md:justify-start w-full">
                                        <Button
                                            size="sm"
                                            className="rounded-md"
                                            onClick={handleReviewSubmit}
                                        >
                                            Submit Review
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                ) : null}
                <Dialog open={openRules} handler={handleOpenRules}>
                    <DialogHeader>
                        <Typography
                            className="mb-1 px-2 font-semibold flex text-incedo-secondary-600 text-left justify-start"
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

export default ReviewDetails;
