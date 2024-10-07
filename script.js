import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

kaboom({
    width: 1000,
    height: 600
});

scene("title", ()=>{
    add([
        rect(width(), height()),
        color(35, 68, 186)
    ])
    add([
        text("Archer"),
        anchor("center"),
        pos(width() / 2, height() / 3),
        scale(2)
    ])
    add([
        text("Click to Start"),
        anchor("center"),
        pos(width() / 2, height() / 2),
        scale(1.5)
    ])
    add([
        text("Click to Charge Bow"),
        anchor("center"),
        pos(width() / 2, height() / 1.5),
        scale(1)
    ])
    onClick(()=>{go("game");});
})

loadSound("game", "sfx/calm-music-64526.mp3");

const music = play("game", {
    volume: 0.3, 
    loop: true,
    paused: true
})

scene("game", ()=>{
    loadSprite("background", "sprites/abackground.jpg");
    loadSprite("player", "sprites/OIP-removebg-preview-overlay (1).png");
    loadSprite("brother", "sprites/OIP-removebg-preview (1).png");
    loadSprite("target", "sprites/OIP-removebg-preview (2).png");
    loadSprite("bow", "sprites/arrow.png");
    loadSprite("arrow_hit", "sprites/arrow_hit.png");

    loadSound("cut", "sfx/bush-cut-103503.mp3");
    loadSound("bow_shot", "sfx/bow_release-85040.mp3");
    loadSound("hit_ground", "sfx/arrow-impact-87260.mp3");
    loadSound("gameover", "sfx/080205_life-lost-game-over-89697.mp3");
    loadSound("brotherhit", "sfx/baby-cry-short-37093.mp3");

    let xv = 0;
    let yv = 0;
    let launch = false;
    let hit = false;
    let liveCount = 3;
    let livesGained = 0;
    let scoreCount = 0;
    let arrowCount = 5;
    let shoot = false;
    music.paused = false;
    add([
        sprite("background", {width:width(), height:height()}),
        pos(0, 0),
        area(),
    ])
    add([
        rect(width(), height() / 8),
        anchor("center"),
        pos(width() / 2, height()),
        color(96, 197, 86)
    ])
    const lives = add([
        text("Lives: " + liveCount),
        pos(36, 128),
        scale(1.5),
    ])
    const score = add([
        text("Score: " + scoreCount),
        pos(36, 32),
        scale(1.5),
    ])
    const arrows = add([
        text("Arrows: " + arrowCount),
        pos(36, 224),
        scale(1.5),
    ])
    add([
        rect(width() / 6, height() / 12),
        pos(width() - width() / 5, 50),
        color(0, 0, 0)
    ])
    const powerMeter = add([
        rect(0, height() / 12),
        pos(width() - width() / 5, 50),
        color(35, 235, 63)
    ])
    const player = add([
        sprite("player"),
        anchor("center"),
        pos(80, height() * 0.85),
        scale(0.25)
    ])
    const brother = add([
        sprite("brother"),
        anchor("center"),
        pos(width() * 0.9, height() * 0.85),
        scale(0.5),
        area(),
        "brother"
    ])
    const target = add([
        sprite("target"),
        anchor("center"),
        pos(width() * 0.91, height() * 0.74),
        scale(0.16),
        area(),
        "target"
    ])
    const bow = add([
        sprite("bow"),
        anchor("center"),
        pos(125, height() * 0.85),
        scale(0.3),
        area(),
        "bow"
    ])
    onMouseDown(()=>{
        if(launch == false && hit == false && arrowCount > 0 && shoot == true && powerMeter.width <= width() / 6) {
            xv += 4;
            yv += 4;
            powerMeter.width += 3.5;
        }
    })
    onMouseRelease(()=>{
        if(arrowCount > 0 && shoot == true) {
            launch = true;
            powerMeter.width = 0;
            play("bow_shot");
        }
    })
    bow.onCollide("brother", ()=>{
        liveCount--;
        lives.text = "Lives: " + liveCount;
        arrowCount--;
        arrows.text = "Arrows: " + arrowCount;
        add([
            sprite("arrow_hit"),
            pos(bow.pos),
            scale(0.3),
        ])
        play("brotherhit");
        reset();
    })
    bow.onCollide("target", ()=>{
        scoreCount++;
        livesGained++;
        if(livesGained % 3 == 0) {
            liveCount++;
            lives.text = "Lives: " + liveCount;
        }
        score.text = "Score: " + scoreCount;
        arrowCount++;
        arrows.text = "Arrows: " + arrowCount;
        play("cut");
        reset();
    })
    wait(0.3, ()=>{
        shoot = true;
    })
    onUpdate(()=>{
        if(launch == true && hit == false) {
            bow.pos.x += xv;
            bow.pos.y -= yv;
            xv *= 0.8;
            if(yv <= 1) {
                yv -= 0.75;
                xv += 1;
            }
            else
                yv -= yv * 0.9;
        }
        if(bow.pos.y > height() - (height() / 8)) {
            hit = true;
            launch = false;
            xv = 0;
            yv = 0;
            arrowCount--;
            arrows.text = "Arrows: " + arrowCount;
            add([
                sprite("bow"),
                pos(bow.pos),
                scale(0.3),
            ])
            play("hit_ground");
            reset();
        }
        if(arrowCount == 0 || liveCount == 0)
            go("gameover");
    })
    function reset() {
        bow.pos.x = 125;
        bow.pos.y = height() * 0.85;
        launch = false;
        hit = false;
        xv = 0;
        yv = 0;
    }
})

scene("gameover", ()=>{
    music.paused = true;
    play("gameover");
    add([
        rect(width(), height()),
        color(247, 35, 22)
    ])
    add([
        text("GAME OVER"),
        anchor("center"),
        pos(width() / 2, height() / 3),
        scale(2),
        color(0, 0, 0)
    ])
    add([
        text("You either ran out of arrows or lives"),
        anchor("center"),
        pos(width() / 2, height() / 2),
        scale(1.5),
        color(0, 0, 0)
    ])
    add([
        text("Click to Restart"),
        anchor("center"),
        pos(width() / 2, height() / 1.5),
        scale(1.5),
        color(0, 0, 0)
    ])
    onClick(()=>{go("game");});
})

go("title");