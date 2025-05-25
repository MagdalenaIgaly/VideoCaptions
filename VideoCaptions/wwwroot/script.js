window.addEventListener("DOMContentLoaded", () => {

    // Get "name" parameter from URL
    const params = new URLSearchParams(window.location.search);
    const video_name = params.get("name");

    // Array to store transcript cue and its corresponding HTML element
    let transcript_lines = [];

    const next_btn = document.getElementById("next_video_btn");

    // No video name provided in URL
    if (!video_name) {
        document.body.innerHTML = "<p>Error: No video specified.</p>";
        return;
    }

    // Set video name and "Next" btn
    if (video_name == "video_1") {
        video_title.innerHTML = "Currently playing: Missing Super Suit"; 
        next_btn.href = "video.html?name=video_2";
    }
    else {
        video_title.innerHTML = "Currently playing: Alex vs. Tumbo"; 
        next_btn.href = "video.html?name=video_1";
    }

    // Get references to video element
    const video = document.getElementById("video");
    const source = document.getElementById("video_source");
    const track = document.getElementById("video_track");

    // Set source and track
    const base_path = `videos/${video_name}`;
    source.src = `${base_path}/clip.mp4`;
    track.src = `${base_path}/captions.vtt`;

    // Load video
    video.load();

    // Prepare transcript container
    const transcript_content = document.getElementById("transcript_content");
    transcript_content.innerHTML = "";

    // Get references to font/style controls
    const font_select = document.getElementById("font_select");
    const font_size_input = document.getElementById("font_size");
    const font_color_input = document.getElementById("font_color");
    const bg_color_input = document.getElementById("bg_color");

    // Creating <style> tag o dynamically update cue styles
    let cue_style_tag = document.createElement("style");
    document.head.appendChild(cue_style_tag);

    // Function to update styling of the video captions
    function update_cue_style() {
        const font = font_select ? font_select.value : "Arial";
        const size = font_size_input ? font_size_input.value + "px" : "14px";
        const color = font_color_input ? font_color_input.value : "#000000";
        const bg = bg_color_input ? bg_color_input.value : "#ffffff";

        cue_style_tag.textContent = `
            video::cue {
                font-family: ${font};
                font-size: ${size};
                color: ${color};
                background-color: ${bg};
            }
        `;
    }

    update_cue_style();

    // Event listeners for styles
    if (font_select) font_select.addEventListener("change", update_cue_style);
    if (font_size_input) font_size_input.addEventListener("input", update_cue_style);
    if (font_color_input) font_color_input.addEventListener("input", update_cue_style);
    if (bg_color_input) bg_color_input.addEventListener("input", update_cue_style);
    
    // When captions track is loaded, create transcript lines for each cue
    track.addEventListener("load", () => {
        const cues = track.track.cues;

        for (let cue of cues) {
            const div = document.createElement("div");
            div.className = "transcript_line";
            div.textContent = `${formatTime(cue.startTime)} ${cue.text}`;
            div.addEventListener("click", () => {
                video.currentTime = cue.startTime;
                video.play();
            });
            transcript_content.appendChild(div);
            transcript_lines.push({ cue, element: div });
        }
    });

    // Sync transcript highlighting and auto-scroll as video plays
    video.addEventListener("timeupdate", () => {
        const currentTime = video.currentTime;

        for (let { cue, element } of transcript_lines) {
            const isActive = currentTime >= cue.startTime && currentTime <= cue.endTime;

            if (isActive && !element.classList.contains("active")) {

                // Remove active class from any previously active transcript line
                document.querySelectorAll(".transcript_line.active").forEach(el =>
                    el.classList.remove("active")
                );

                // Highlight current active transcript line
                element.classList.add("active");

                // Scroll active line to the top of transcript box smoothly
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    });

    // Helper function: formats seconds into mm:ss format for transcript timestamps
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

});
