import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
    // List,
    // ListItem,
    // ListItemPrefix,
    // Avatar,
    Card,
    Typography,
    CardHeader,
    CardBody,
    Input,
    Textarea,
    // IconButton,
    Button,
    Chip,
    Tooltip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
    fetchTeamDetails,
    ideaSubmission,
    selectTeams,
} from "../features/team/teamSlice";
import { repoSubmission } from "../features/team/teamSlice";
import { TEAMS, USER } from "../constants";
import {
    selectUserDetails,
    selectUserId,
    selectUserToken,
} from "../features/user/userSlice";
import { toast } from "react-toastify";
import {
    botRewrite,
    botTechRecommendation,
    clearBotRewriteOutput,
    selectBotRecommendationOutput,
    selectBotRewriteOutput,
} from "../features/bot/botSlice";
import { Link } from "react-router-dom";

const DOMAINS = [
    { name: "Data and AI", value: "data" },
    { name: "Ops Transformation", value: "operations" },
    { name: "Cloud and Digital", value: "cloud" },
    { name: "Experience Design", value: "ux" },
    { name: "Others", value: "others" },
];

const IdeaDetails = () => {
    const dispatch = useDispatch();
    const userData = useSelector(selectUserDetails);
    const botRecommendationData = useSelector(selectBotRecommendationOutput);
    const [recommendations, setRecommendations] = useState([]);

    const botRewriteData = useSelector(selectBotRewriteOutput);
    const [rewrittenText, setRewrittenText] = useState("");

    const [openRewrite, setOpenRewrite] = useState(false);

    const handleOpenRewrite = () => {
        dispatch(clearBotRewriteOutput());
        setOpenRewrite(false);
    };

    const handleOverWriteText = () => {
        setIdeaData((prevstate) => ({ ...prevstate, ideaBody: rewrittenText }));
        dispatch(clearBotRewriteOutput());
        setOpenRewrite(false);
    };

    const hackathonId = userData?.assignedHackathon || null;
    const userId = userData?.userId || null;

    const teamsData = useSelector(selectTeams);

    const [teamDetails, setTeamDetails] = useState({});
    useEffect(() => {
        if (userData && teamsData.length > 0) {
            setTeamDetails(
                teamsData.find(
                    (team) => team.hackathonId === userData?.assignedHackathon
                )
            );
        }
    }, [teamsData, userData]);

    const [isLeader, setIsLeader] = useState(false);

    useEffect(() => {
        if (teamDetails.teamUserDetailsDTOs) {
            setIsLeader(
                teamDetails?.teamUserDetailsDTOs?.find(
                    (member) => member?.userId === userData?.userId
                )?.leader === true
            );
        }
    }, [teamDetails]);

    const [repoData, setRepoData] = useState({});
    const [ideaData, setIdeaData] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isShortlisted, setIsShortlisted] = useState(false);
    const [isImplemented, setIsImplemented] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    useEffect(() => {
        if (teamDetails?.status === "submitted") {
            setIsSubmitted(true);
            setIdeaData({
                ...ideaData,
                ideaTitle: teamDetails.ideaTitle,
                ideaDomain: teamDetails.ideaDomain,
                ideaBody: teamDetails.ideaBody,
            });
        }
        if (teamDetails?.status === "selected") {
            setIsShortlisted(true);
            setIdeaData({
                ...ideaData,
                ideaTitle: teamDetails.ideaTitle,
                ideaDomain: teamDetails.ideaDomain,
                ideaBody: teamDetails.ideaBody,
            });
        }
        if (teamDetails?.status === "implemented") {
            setIsImplemented(true);
            setIdeaData({
                ...ideaData,
                ideaTitle: teamDetails.ideaTitle,
                ideaDomain: teamDetails.ideaDomain,
                ideaBody: teamDetails.ideaBody,
            });

            setRepoData({
                ...repoData,
                ideaFiles: teamDetails.ideaFiles,
                ideaRepo: teamDetails.ideaRepo,
            });
        }

        if (teamDetails?.status === "rejected") {
            setIsRejected(true);
            setIdeaData({
                ...ideaData,
                ideaTitle: teamDetails.ideaTitle,
                ideaDomain: teamDetails.ideaDomain,
                ideaBody: teamDetails.ideaBody,
            });
        }
    }, [teamDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIdeaData((prevstate) => ({ ...prevstate, [name]: value }));
    };

    const token = useSelector(selectUserToken);

    const [validationIdeaErrors, setValidationIdeaErrors] = useState({});

    const handleSubmit = async () => {
        const newErrors = {};
        if (!ideaData.ideaTitle) {
            newErrors.ideaTitle = "Idea Title is Required!";
        }
        if (ideaData.ideaTitle && ideaData.ideaTitle.length > 255) {
            newErrors.ideaTitle =
                "Idea Title Should Not Contain More Than 255 Characters";
        }
        if (!ideaData.ideaDomain) {
            newErrors.ideaDomain = "Theme Is Required";
        }
        if (!ideaData.ideaBody) {
            newErrors.ideaBody = "Idea Description Is Required";
        }
        if (ideaData.ideaBody && ideaData.ideaBody.length > 3000) {
            newErrors.ideaBody =
                "Idea Title Should Not Contain More Than 3000 Characters";
        }
        if (Object.keys(newErrors).length > 0) {
            setValidationIdeaErrors(newErrors);
        } else {
            try {
                // console.log(ideaData);
                await dispatch(
                    ideaSubmission({ hackathonId, userId, ideaData, token })
                ).unwrap();
                toast.success("Idea submitted successfully!");
                await dispatch(
                    fetchTeamDetails({ userId: userData.userId, token })
                ).unwrap();
                // console.log(teamsData);
                // console.log(teamsData);
            } catch (error) {
                toast.error(`Error: ${error?.message}`);
            }
        }
        setValidationIdeaErrors(newErrors);
    };

    const handleRepoChange = (e) => {
        const { name, value } = e.target;
        setRepoData((prevstate) => ({ ...prevstate, [name]: value }));
    };

    const [validationRepoErrors, setValidationRepoErrors] = useState({});

    const validateLink = (link) => {
        // Regex pattern for email validation
        const pattern =
            /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;
        return pattern.test(link);
    };

    const handleRepoSubmit = async () => {
        const newErrors = {};
        if (!repoData.ideaRepo) {
            newErrors.ideaRepo = "Repository Link is Required!";
        }
        if (repoData.ideaRepo && !validateLink(repoData.ideaRepo)) {
            newErrors.ideaRepo = "Link is Invalid!";
        }
        if (repoData.ideaRepo && repoData.ideaRepo.length > 255) {
            newErrors.ideaRepo =
                "Repository Link Should Not Contain More Than 255 Characters";
        }
        if (!repoData.ideaFiles) {
            newErrors.ideaFiles = "Drive Link Is Required";
        }
        if (repoData.ideaFiles && !validateLink(repoData.ideaFiles)) {
            newErrors.ideaFiles = "Link is Invalid!";
        }
        if (repoData.ideaFiles && repoData.ideaFiles.length > 255) {
            newErrors.ideaFiles =
                "Drive Link Should Not Contain More Than 255 Characters";
        }
        if (Object.keys(newErrors).length > 0) {
            setValidationRepoErrors(newErrors);
        } else {
            try {
                // console.log(repoData);
                await dispatch(
                    repoSubmission({ hackathonId, userId, repoData, token })
                ).unwrap();
                toast.success("Idea submitted successfully!");
                await dispatch(
                    fetchTeamDetails({ userId: userData.userId, token })
                ).unwrap();
            } catch (error) {
                toast.error(`Error: ${error?.message}`);
            }
        }
        setValidationRepoErrors(newErrors);
    };

    useEffect(() => {
        setRecommendations(botRecommendationData);
    }, [botRecommendationData]);

    useEffect(() => {
        setRewrittenText(botRewriteData);
    }, [botRewriteData]);

    const handleBotRecommendation = async () => {
        const newErrors = {};
        if (!ideaData.ideaTitle) {
            newErrors.ideaTitle = "Idea Title is Required!";
        }
        if (ideaData.ideaTitle && ideaData.ideaTitle.length > 255) {
            newErrors.ideaTitle =
                "Idea Title Should Not Contain More Than 255 Characters";
        }
        if (!ideaData.ideaDomain) {
            newErrors.ideaDomain = "Theme Is Required";
        }
        if (!ideaData.ideaBody) {
            newErrors.ideaBody = "Idea Description Is Required";
        }
        if (ideaData.ideaBody && ideaData.ideaBody.length > 3000) {
            newErrors.ideaBody =
                "Idea Title Should Not Contain More Than 3000 Characters";
        }
        if (Object.keys(newErrors).length > 0) {
            setValidationIdeaErrors(newErrors);
        } else {
            try {
                await toast.promise(
                    dispatch(
                        botTechRecommendation({
                            botData: { data: ideaData.ideaBody },
                            token,
                        })
                    ).unwrap(),
                    {
                        pending: "Fetching recommendations...",
                        success: `Fetched recommendations successfully!`,
                        error: {
                            render({ data }) {
                                return `Error: ${data?.message}`;
                            },
                        },
                    }
                );
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }
        setValidationIdeaErrors(newErrors);
    };

    const handleBotRewrite = async () => {
        const newErrors = {};
        if (!ideaData.ideaTitle) {
            newErrors.ideaTitle = "Idea Title is Required!";
        }
        if (ideaData.ideaTitle && ideaData.ideaTitle.length > 255) {
            newErrors.ideaTitle =
                "Idea Title Should Not Contain More Than 255 Characters";
        }
        if (!ideaData.ideaDomain) {
            newErrors.ideaDomain = "Theme Is Required";
        }
        if (!ideaData.ideaBody) {
            newErrors.ideaBody = "Idea Description Is Required";
        }
        if (ideaData.ideaBody && ideaData.ideaBody.length > 3000) {
            newErrors.ideaBody =
                "Idea Title Should Not Contain More Than 3000 Characters";
        }   
        if (Object.keys(newErrors).length > 0) {
            setValidationIdeaErrors(newErrors);
        } else {
            try {
                await toast.promise(
                    dispatch(
                        botRewrite({
                            botData: { data: ideaData.ideaBody },
                            token,
                        })
                    ).unwrap(),
                    {
                        pending: "Fetching suggestion...",
                        success: `Fetched suggestion successfully!`,
                        error: {
                            render({ data }) {
                                return `Error: ${data?.message}`;
                            },
                        },
                    }
                );
                setOpenRewrite(true);
            } catch (error) {
                console.log(`Error: ${error?.message}`);
            }
        }
        setValidationIdeaErrors(newErrors);
    };

    return (
        <Card className="w-full">
            <CardHeader floated={false} shadow={false}>
                <Typography variant="h4">Idea</Typography>
            </CardHeader>
            <CardBody className="w-full py-4">
                <div className="grid col-span-1 lg:grid-cols-5 gap-4">
                    <div className="col-span-1 lg:col-span-3">
                        {!isLeader ? (
                            <Typography
                                variant="small"
                                className="mb-2 text-gray-600"
                            >
                                Only Team Leader can submit the idea.
                            </Typography>
                        ) : null}
                        <Input
                            disabled={
                                !isLeader ||
                                isSubmitted ||
                                isShortlisted ||
                                isRejected ||
                                isImplemented
                            }
                            label="Idea Title*"
                            value={ideaData?.ideaTitle || ""}
                            name="ideaTitle"
                            onChange={handleChange}
                        />
                        {validationIdeaErrors.ideaTitle && (
                            <Typography className="text-red-500 text-xs w-fit">
                                {validationIdeaErrors.ideaTitle}
                            </Typography>
                        )}
                        <div className="relative mt-3 flex w-full">
                            <Menu placement="bottom-start">
                                <MenuHandler>
                                    <Button
                                        disabled={
                                            !isLeader ||
                                            isSubmitted ||
                                            isShortlisted ||
                                            isRejected ||
                                            isImplemented
                                        }
                                        ripple={false}
                                        variant="text"
                                        color="blue-gray"
                                        className="relative flex h-10 w-full justify-between gap-2 border border-blue-gray-200 bg-blue-gray-500/10 pl-3 pr-2"
                                    >
                                        {ideaData?.ideaDomain || "Idea Domain*"}
                                        <ChevronDownIcon className="absolute w-4 h-4 right-2" />
                                    </Button>
                                </MenuHandler>
                                <MenuList className="max-h-[20rem] max-w-[18rem]">
                                    {DOMAINS.map((domain, index) => {
                                        return (
                                            <MenuItem
                                                key={index}
                                                value={domain.name}
                                                className="flex items-center gap-2"
                                                onClick={
                                                    () =>
                                                        // setSelectedTheme(
                                                        //     themes[index]
                                                        // )
                                                        setIdeaData({
                                                            ...ideaData,
                                                            ideaDomain:
                                                                DOMAINS[index]
                                                                    .name,
                                                        })
                                                    // console.log(domain.name)
                                                }
                                            >
                                                {domain.name}
                                            </MenuItem>
                                        );
                                    })}
                                </MenuList>
                            </Menu>
                        </div>

                        {validationIdeaErrors.ideaDomain && (
                                <Typography className="text-red-500 text-xs w-fit">
                                    {validationIdeaErrors.ideaDomain}
                                </Typography>
                            )}
                        <div className="mt-3">
                            <Textarea
                                disabled={
                                    !isLeader ||
                                    isSubmitted ||
                                    isShortlisted ||
                                    isRejected ||
                                    isImplemented
                                }
                                label="Idea Description*"
                                name="ideaBody"
                                value={ideaData?.ideaBody || ""}
                                onChange={handleChange}
                            />
                            {validationIdeaErrors.ideaBody && (
                                <Typography className="text-red-500 text-xs w-fit">
                                    {validationIdeaErrors.ideaBody}
                                </Typography>
                            )}
                        </div>
                        {(isShortlisted || isImplemented) && (
                            <div>
                                <div className="mt-3">
                                    <Input
                                        label="Repository Link"
                                        value={repoData?.ideaRepo || ""}
                                        disabled={!isLeader || isImplemented}
                                        name="ideaRepo"
                                        onChange={handleRepoChange}
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                // className="h-4 w-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                                                />
                                            </svg>
                                        }
                                    />
                                </div>

                                {validationRepoErrors.ideaRepo && (
                                    <Typography className="text-red-500 text-xs w-fit">
                                        {validationRepoErrors.ideaRepo}
                                    </Typography>
                                )}
                                <div className="mt-3">
                                    <Input
                                        label="Drive Link"
                                        disabled={!isLeader || isImplemented}
                                        value={repoData?.ideaFiles || ""}
                                        name="ideaFiles"
                                        onChange={handleRepoChange}
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                // className="h-4 w-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                                                />
                                            </svg>
                                        }
                                    />
                                </div>
                                {validationRepoErrors.ideaFiles && (
                                    <Typography className="text-red-500 text-xs w-fit">
                                        {validationRepoErrors.ideaFiles}
                                    </Typography>
                                )}
                            </div>
                        )}

                        <div className="flex w-full justify-between mt-3 py-1.5">
                            <div className="flex gap-2 justify-center md:justify-end w-full flex-wrap">
                                {isLeader &&
                                    !isSubmitted &&
                                    !isRejected &&
                                    !isImplemented &&
                                    !isShortlisted && (
                                        <Button
                                            variant="outlined"
                                            size="sm"
                                            className="rounded-md"
                                            onClick={handleBotRewrite}
                                        >
                                            Rewrite
                                        </Button>
                                    )}
                                <Button
                                    variant="outlined"
                                    size="sm"
                                    className="rounded-md"
                                    onClick={handleBotRecommendation}
                                >
                                    Recommedations
                                </Button>
                                {isLeader &&
                                    !isSubmitted &&
                                    !isRejected &&
                                    !isImplemented &&
                                    !isShortlisted && (
                                        <Button
                                            size="sm"
                                            className="rounded-md"
                                            onClick={handleSubmit}
                                        >
                                            Submit Idea
                                        </Button>
                                    )}
                                {isLeader &&
                                    isShortlisted &&
                                    !isImplemented && (
                                        <Button
                                            size="sm"
                                            className="rounded-md"
                                            disabled={isImplemented}
                                            onClick={handleRepoSubmit}
                                        >
                                            Submit Implementation
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 lg:col-span-2">
                        {recommendations.length > 0 ? (
                            <div>
                                <Typography className="font-bold">
                                    Recommedations:-
                                </Typography>
                                <div className="flex flex-row flex-wrap gap-2">
                                    {recommendations.map((tool, index) => (
                                        <Tooltip
                                            key={index}
                                            content={tool.description}
                                        >
                                            <Link
                                                to={tool.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span>
                                                    <Chip
                                                        variant="ghost"
                                                        color="blue"
                                                        size="sm"
                                                        value={tool.name}
                                                        className="mx-auto"
                                                    />
                                                </span>
                                            </Link>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
                <Dialog open={openRewrite} handler={handleOpenRewrite}>
                    <DialogHeader>
                        <Typography
                            className="pb-0 px-2 font-semibold flex text-incedo-secondary-600 text-left justify-start"
                            variant="h2"
                            // color="black"
                        >
                            Suggestion
                        </Typography>
                    </DialogHeader>
                    <DialogBody className="pt-0">
                        <div className="overflow-auto max-h-[60vh]">
                            <div className="w-full px-2 rounded-2xl">
                                <Typography>{rewrittenText}</Typography>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <div className="flex flex-row gap-2">
                            <Button
                                variant="text"
                                color="red"
                                onClick={handleOpenRewrite}
                                className="mr-1"
                            >
                                <span>Cancel</span>
                            </Button>
                            <Button
                                variant="text"
                                color="green"
                                onClick={handleOverWriteText}
                                className="mr-1"
                            >
                                <span>Overwrite</span>
                            </Button>
                        </div>
                    </DialogFooter>
                </Dialog>
            </CardBody>
        </Card>
    );
};

export default IdeaDetails;
