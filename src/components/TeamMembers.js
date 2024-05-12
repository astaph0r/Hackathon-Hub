import React, { useState, useEffect } from "react";
import {
    List,
    ListItem,
    ListItemPrefix,
    Avatar,
    Card,
    Typography,
    CardHeader,
    CardBody,
    Tooltip,
    Progress,
    // Input,
    // Textarea,
    // IconButton,
    // Button,
} from "@material-tailwind/react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchTeamDetails, selectTeams } from "../features/team/teamSlice";
import { IS_DEVELOPMENT, TEAMS, USER } from "../constants";
import { selectUserDetails, selectUserId } from "../features/user/userSlice";
import {
    selectHackathonById,
    selectHackathons,
} from "../features/hackathon/hackathonSlice";

const TeamMembers = () => {
    const dispatch = useDispatch();
    const teamsData = useSelector(selectTeams);
    const userData = useSelector(selectUserDetails);
    const hackathon = useSelector((state) =>
        selectHackathonById(state, userData?.assignedHackathon)
    );
    const [selectedHackathon, setSelectedHackathon] = useState(null);
    const [teamDetails, setTeamDetails] = useState([]);

    useEffect(() => {
        if (userData && teamsData.length > 0) {
            setTeamDetails(
                teamsData.find(
                    (team) => team.hackathonId === userData?.assignedHackathon
                )?.teamUserDetailsDTOs
            );
            setSelectedHackathon(hackathon);
        }
    }, [teamsData, userData]);

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

    const startTime = new Date(selectedHackathon?.startDate);
    const ideaSubmissionDeadline = new Date(
        selectedHackathon?.ideaSubmissionDeadline
    );
    const shortListDeadline = new Date(selectedHackathon?.shortListDeadline);
    const implementationDeadline = new Date(
        selectedHackathon?.implementationSubmissionDeadline
    );

    const reviewStartTime = new Date(selectedHackathon?.reviewStartTime);
    const reviewEndTime = new Date(selectedHackathon?.reviewEndTime);

    const ISTOffset = 330; //+5:30hrs

    const [currentDate, setCurrentDate] = useState(
        new Date(
            new Date().getTime() +
                (ISTOffset + new Date().getTimezoneOffset()) * 60000
        )
    );

    const [duringSubmission, setDuringSubmission] = useState(
        currentDate > startTime && currentDate < ideaSubmissionDeadline
    );

    const [beforeSubmission, setBeforeSubmission] = useState(
        currentDate < startTime
    );
    const [afterSubmission, setAfterSubmission] = useState(
        currentDate > ideaSubmissionDeadline
    );
    const [percentageElapsedSubmission, setPercentageElapsedSubmission] =
        useState(
            100 -
                Math.floor(
                    ((ideaSubmissionDeadline - currentDate) * 100) /
                        (ideaSubmissionDeadline - startTime)
                )
        );

    const [timeLeftSubmission, setTimeLeftSubmission] = useState(
        formatSecondsToDDHHMMSS(ideaSubmissionDeadline - currentDate)
    );

    const [duringImplementation, setDuringImplementation] = useState(
        currentDate > shortListDeadline && currentDate < implementationDeadline
    );

    const [beforeImplementation, setBeforeImplementation] = useState(
        currentDate < shortListDeadline
    );
    const [afterImplementation, setAfterImplementation] = useState(
        currentDate > implementationDeadline
    );
    const [
        percentageElapsedImplementation,
        setPercentageElapsedImplementation,
    ] = useState(
        100 -
            Math.floor(
                ((implementationDeadline - currentDate) * 100) /
                    (implementationDeadline - shortListDeadline)
            )
    );

    const [timeLeftImplementation, setTimeLeftImplementation] = useState(
        formatSecondsToDDHHMMSS(implementationDeadline - currentDate)
    );

    useEffect(() => {
        const updateCurrentTime = setTimeout(function () {
            setCurrentDate(
                new Date(
                    new Date().getTime() +
                        (ISTOffset + new Date().getTimezoneOffset()) * 60000
                )
            );
            setDuringSubmission(
                currentDate > startTime && currentDate < ideaSubmissionDeadline
            );
            setBeforeSubmission(currentDate < startTime);
            setAfterSubmission(currentDate > ideaSubmissionDeadline);
            setPercentageElapsedSubmission(
                100 -
                    Math.floor(
                        ((ideaSubmissionDeadline - currentDate) * 100) /
                            (ideaSubmissionDeadline - startTime)
                    )
            );
            setTimeLeftSubmission(
                formatSecondsToDDHHMMSS(ideaSubmissionDeadline - currentDate)
            );

            setDuringImplementation(
                currentDate > shortListDeadline &&
                    currentDate < implementationDeadline
            );
            setBeforeImplementation(currentDate < shortListDeadline);
            setAfterImplementation(currentDate > implementationDeadline);
            setPercentageElapsedImplementation(
                100 -
                    Math.floor(
                        ((implementationDeadline - currentDate) * 100) /
                            (implementationDeadline - shortListDeadline)
                    )
            );
            setTimeLeftImplementation(
                formatSecondsToDDHHMMSS(implementationDeadline - currentDate)
            );
        }, 1000);

        return () => {
            // this should work flawlessly besides some milliseconds lost here and there
            clearTimeout(updateCurrentTime);
        };
    }, [currentDate]);

    console.log(duringSubmission);
    
    console.log(currentDate);
    console.log(startTime);
    console.log(ideaSubmissionDeadline);

    return (
        <Card className="w-full mb-4">
            <CardHeader floated={false} shadow={false}>
                <Typography variant="h4">Team Members</Typography>
            </CardHeader>
            <CardBody className="p-4 py-2">
                {teamDetails.length === 0 ? (
                    <Typography variant="paragraph" color="gray">
                        No team members found.
                    </Typography>
                ) : (
                    <List className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teamDetails.map((member) => {
                            return (
                                <ListItem key={member.userId}>
                                    <ListItemPrefix>
                                        <Avatar
                                            variant="circular"
                                            alt="candice"
                                            src={`https://ui-avatars.com/api/?background=random&name=${member?.name[0]}`}
                                        />
                                    </ListItemPrefix>
                                    <div>
                                        <div className="flex flex-row items-baseline gap-1">
                                            <Typography
                                                variant="h6"
                                                color="blue-gray"
                                            >
                                                {member.name}
                                            </Typography>
                                            {member.leader && (
                                                <Tooltip content="Leader">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 16 16"
                                                        fill="blue"
                                                        className="w-3 h-3"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <Typography
                                            variant="small"
                                            color="gray"
                                            className="font-normal"
                                        >
                                            {member.email}
                                        </Typography>
                                    </div>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
                <div className="w-full px-4 mb-2">
                    <div className="mb-2 flex items-center justify-between gap-4">
                        <Typography color="blue-gray" variant="h6">
                            {beforeSubmission || duringSubmission
                                ? "Submission Deadline"
                                : afterSubmission ||
                                  beforeImplementation ||
                                  duringImplementation ||
                                  afterImplementation
                                ? "Implementation Deadline"
                                : null}
                        </Typography>

                        {IS_DEVELOPMENT ? (
                            <Typography color="orange" variant="h6">
                                Presentation Mode
                            </Typography>
                        ) : beforeSubmission ? (
                            <Typography color="red" variant="h6">
                                {"Submission period hasn't started"}
                            </Typography>
                        ): duringSubmission ? (
                            <Typography color="blue-gray" variant="h6">
                                {timeLeftSubmission}
                            </Typography>
                        ) : afterSubmission && beforeImplementation ? (
                            <Typography color="red" variant="h6">
                                {"Implementation period hasn't started"}
                            </Typography>
                        ) : afterSubmission && duringImplementation ? (
                            <Typography color="blue-gray" variant="h6">
                                {timeLeftImplementation}
                            </Typography>
                        ) : afterSubmission && afterImplementation ? (
                            <Typography color="red" variant="h6">
                                {"Implementation period is over."}
                            </Typography>
                        ) : null}
                    </div>{" "}
                    {!IS_DEVELOPMENT &&
                    duringSubmission &&
                    !duringImplementation ? (
                        <Progress value={percentageElapsedSubmission} />
                    ) : null}
                    {!IS_DEVELOPMENT &&
                    duringImplementation &&
                    !duringSubmission ? (
                        <Progress value={percentageElapsedImplementation} />
                    ) : null}
                </div>
            </CardBody>
        </Card>
    );
};

export default TeamMembers;
