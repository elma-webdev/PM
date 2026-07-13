
import fetch from "node-fetch";
import base64 from "base-64";
import env from "dotenv";
const account_id="8ZB81vbYRn6w0SNPVZBotg"
const client_id="f1CVYsAORXa8Swqu7OPEDw"
const client_secret="0bvWKcEcXwJ3qRSMap2uT78nmW60TO9m"
const secret_token="yZos4i6eSoSbpHON-Jhvgw"

// curl -X POST https://zoom.us/oauth/token -d 'grant_type=account_credentials' -d 'account_id=8ZB81vbYRn6w0SNPVZBotg' -H 'Host: zoom.us' -H 'Authorization: Basic Base64Encoded(f1CVYsAORXa8Swqu7OPEDw:0bvWKcEcXwJ3qRSMap2uT78nmW60TO9m)'

const getAuthHeaders = () => {
    return {
      Authorization: `Basic ${base64.encode(
        `${client_id}:${client_secret}`,
      )}`,
      "Content-Type": "application/json",
    };
};
const generateZoomToken = async() : Promise<any> => {

    try{

        const response=await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${account_id}`,{
            method:"POST",
            headers:getAuthHeaders(),
            body:`secret_token=${secret_token}`
        })

    const jsonResponse = await response.json();
    console.log("generateZoomAccessToken Response --> ", jsonResponse);
    return jsonResponse

    } catch (error) {
        console.log("generateZoomAccessToken Error --> ", error);
        throw error;
    }
}


const generateZoomMeeting = async () => {
    try {
        const zoomAccessToken = await generateZoomToken();

        const response = await fetch(
            `https://api.zoom.us/v2/users/me/meetings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${zoomAccessToken.access_token}`,
                },
                body: JSON.stringify({
                    agenda: "Sessão de saúde mental",
                    default_password: false,
                    duration: 40,
                    password: "sessao123",
                    settings: {
                        allow_multiple_devices: true,
                        // alternative_hosts: "elmaeira@gmail.com",
                        alternative_hosts_email_notification: true,
                        breakout_room: {
                            enable: true,
                            rooms: [
                                {
                                    name: "sala1",
                                    participants: [
                                        "elmaeira@gmail.com",
                                        "jujap2024@gmail.com",
                                    ],
                                },
                            ],
                        },
                        calendar_type: 1,
                        contact_email: "jujap2024@gmail.com",
                        contact_name: "Juelma Pereira",
                        // email_notification: true,
                        encryption_type: "enhanced_encryption",
                        focus_mode: true,
                        // global_dial_in_countries: ["US"],
                        host_video: true,
                        join_before_host: true,
                        meeting_authentication: false,
                        // meeting_invitees: [
                        //     {
                        //         email: "jujap2024@gmail.com",
                        //     },
                        // ],
                        mute_upon_entry: true,
                        participant_video: true,
                        private_meeting: true,
                        waiting_room: true,
                        watermark: false,
                        continuous_meeting_chat: {
                            enable: true,
                        },
                    },
                    start_time: new Date().toISOString(),
                    timezone: "Africa/Luanda",
                    topic: "Sessão de saúde mental",
                    type: 1, // 1 -> Instant Meeting, 2 -> Scheduled Meeting
                }),
            }
        );

        const jsonResponse = await response.json();

        console.log("generateZoomMeeting JsonResponse --> ", jsonResponse);
    } catch (error) {
        console.log("generateZoomMeeting Error --> ", error);
        throw error;
    }
};
generateZoomMeeting()
// dados:
//id
//  join_url:,
//  chat_join_url:,
//  password:,
// id: ,
//start_url:,
//created_at: ou start_time se for agendada,
//agenda:,
//host_email,
//type
//topic,
//duration