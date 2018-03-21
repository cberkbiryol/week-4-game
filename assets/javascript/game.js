window.onload = function() {
    // First lets update teh health field of each character according to the values in vikrpg.chealth array
    for (var i=0; i < vikrpg.characters.length; i++) {
        $("span[charnm=" + vikrpg.characters[i] + "]").text(vikrpg.chealth[i]);
    }
    // Game divided into 3 stages
    // select character (stage 1)
    // select enemy (stage 2)
    // fight (stage 3)
    // depending on outcome next enemy or restart (directing the process back to stage 2 or stage 1 [restart])
    
    //required button events:     
    // Select Character/enemy button
    $(".btn-primary").click(vikrpg.charSelect);
    // Attack button
    $("#atkButn").click(vikrpg.plyrAttack);
    // Restart game
    $("#rstButn").click(vikrpg.restart);    

    //add a soundtrack which is controlled by the speaker icon located at the top left part of screen
    $(".sound_ctrl").click(function() {        
        if ( $("#audply")[0].paused ) {
            $("#audply")[0].play().loop = true        
            // $("#audply")[0];   
            $(".sound_ctrl").attr("src","assets/images/sound_on.png")
        } else {
            $("#audply")[0].pause(); 
            $(".sound_ctrl").attr("src","assets/images/sound_off.png")            
        }
     })
};

var vikrpg = { characters: ["Ragnar","Rollo","Lagertha","Floki","Ivar"],
            chealth:       [   120,    150,      150,     100,    160 ],
            basedmg:       [    20,     15,       10,       5,     25 ],
            charHealth:     0,
            charDamage:     0,
            gameStage:      1,
            charIndx:       0,
            enmyIndx:       0,
            enmyHealth:     0,
            enmyDamage:     0,
            charElem:       0,
            enmyElem:       0,

            charSelect: function() {
                var charName = $(this).attr("charname");
                var picFile = $(this).closest(".card").find("img").attr("src");  
                if (vikrpg.gameStage === 1) { // ******* if stage 1. select character *******                                              
                    // console.log("Your Character is " + charName);
                    // console.log("Pic file is " + picFile); 
                    vikrpg.charIndx=vikrpg.characters.indexOf(charName)                        
                    vikrpg.charHealth = vikrpg.chealth[vikrpg.charIndx];
                    vikrpg.charDamage = vikrpg.basedmg[vikrpg.charIndx];
                    // console.log(charName + " has health of " + vikrpg.charHealth + " and a base damage of " + vikrpg.charDamage);
                    vikrpg.charElem=$(this).closest(".card").parent();
                    vikrpg.charElem.toggle();   
                    vikrpg.enmyElem=vikrpg.charElem.siblings().children(".card");
                    vikrpg.enmyElem.css("background-color","rgba(255,0,0,0.444)");
                    vikrpg.charsetup(charName,picFile,vikrpg.charHealth);  // Display image & info in Character box
                    vikrpg.gameStage++;    // increment stage to procede 
                    vikrpg.updatemsg();
                    $("#btlcam").attr("src","assets/images/" + charName.toLowerCase() +"_sel.gif");
                }  
                else if (vikrpg.gameStage === 2) { // ******* if stage 2, select enemy *******
                    vikrpg.enmyIndx=vikrpg.characters.indexOf(charName)
                    // console.log("Your current enemy is " + $(this).attr("charname"));
                    // console.log("Pic file is " + picFile);                         
                    vikrpg.enmyHealth = vikrpg.chealth[vikrpg.enmyIndx];
                    vikrpg.enmyDamage = vikrpg.basedmg[vikrpg.enmyIndx];
                    // console.log(charName + " has health of " + vikrpg.enmyHealth + " and a base damage of " + vikrpg.enmyDamage);
                    $(this).closest(".card").addClass("invisible")
                    vikrpg.charsetup(charName,picFile,vikrpg.enmyHealth);  // Display image & info in Defender box      
                    vikrpg.gameStage++;    // increment stage to procede       
                    vikrpg.updatemsg();    
                    $("#btlcam").attr("src","assets/images/" + charName.toLowerCase() +"_sel.gif");    
                }                                
            },                
            plyrAttack: function() {
                if (vikrpg.gameStage === 3) { // ******* if stage 3. start Battle *******
                    if (vikrpg.charHealth > 0 && vikrpg.enmyHealth > 0) {
                        vikrpg.charHealth -= vikrpg.enmyDamage;
                        vikrpg.enmyHealth -= vikrpg.charDamage;
                        $("#battleinfo").text(vikrpg.characters[vikrpg.enmyIndx] + " damaged you by " + vikrpg.enmyDamage + " and you dealt a damage of " + vikrpg.charDamage + " to " + vikrpg.characters[vikrpg.enmyIndx]);           
                        $("#plyrhealth").text(vikrpg.charHealth);
                        $("#defhealth").text(vikrpg.enmyHealth);    
                        vikrpg.charDamage += vikrpg.basedmg[vikrpg.charIndx];    
                        var sldnum=Math.floor(Math.random()*6)+1;
                        $("#btlcam").attr("src","assets/images/randBattl" + sldnum + ".gif")                    
                    } 
                    if ((vikrpg.charHealth <= 0 && vikrpg.enmyHealth >= 0) || vikrpg.charHealth === 0 || vikrpg.charHealth < 0) { // In case of loss
                        $("#rstButn").removeClass("invisible");
                        $("#status").text("YOU LOST!!! Click Restart for new game...");
                        $("#battleinfo").text("...");                        
                    } 
                    if (vikrpg.enmyHealth <= 0 && vikrpg.charHealth > 0) { // In case of win                                              
                        if ($(".card.invisible").length===4) { // if no more characters left in the deck 
                            $("#status").text("YOU WIN!!! Click Restart for new game... ");
                            $("#battleinfo").text(vikrpg.characters[vikrpg.enmyIndx] + " was your final enemy, whom you defeated.");
                            $("#rstButn").removeClass("invisible");
                        } else {
                            $("#status").text("You defeated " + vikrpg.characters[vikrpg.enmyIndx] + ". Select new enemy");                            
                            $("#battleinfo").text("...");
                            vikrpg.gameStage = 2;
                            vikrpg.charsetup("Character Name","assets/images/placeholder.png","...");
                        }                        
                        //console.log($(".card.invisible").length)
                    }
                 } else {
                    $("#status").text("No enemy to attack!!");
                 }
            },
            restart: function() {
                vikrpg.gameStage = 2;
                vikrpg.charsetup("Defender Name","assets/images/placeholder.png","...");
                vikrpg.gameStage = 1;
                vikrpg.charsetup("Character Name","assets/images/placeholder.png","...");
                $("#rstButn").addClass("invisible");
                vikrpg.updatemsg();
                $(".card.invisible").removeClass("invisible");
                vikrpg.charElem.toggle();
                $("#battleinfo").text("...");
                vikrpg.enmyElem.css("background-color","rgba(204, 203, 202, 0.644)");
                $("#btlcam").attr("src","assets/images/viki.gif")
            },
            charsetup: function(charName,picFile,hlth) {
                if (vikrpg.gameStage === 1) {
                    var namID="#plyrName";
                    var picID="#plyrPic";
                    var hltID="#plyrhealth";
                    var helth=vikrpg.charHealth;
                }
                else if (vikrpg.gameStage === 2) {
                    var namID="#defName";
                    var picID="#defPic";
                    var hltID="#defhealth";
                }
                $(namID).text(charName.toUpperCase());
                $(picID).attr("src",picFile);
                $(hltID).text(hlth)
            },
            updatemsg: function(){
                if (vikrpg.gameStage === 1) {
                    $("#status").text("Select a character to begin...");
                } else if (vikrpg.gameStage === 2) {
                    $("#status").text("Select an enemy to continue...");
                } else if (vikrpg.gameStage === 3) {
                    $("#status").text("Atack your enemy...");
                }
            }
                   


    }


