
let batteryOn = 0;
let turbineOn = 0;
let turbineNodeOn = 0;
let batteryNodeOn = 0;
let motorOn = 0;
let fuelOn = 0;
let motorClick = 0;
let turbineClick = 0;
let propellerSpin = 0;
let transmissionFlag = 0; // 1 = up, 0 = none, -1 = down
let turbineBypassOn = 0
let batteryBypassOn = 0
let queryMode = 0;
let activeInfoBox = null;


/* ---------------------------------------------------------------------------------------------------- */
/* -----------------------------------------GET COMPONENTS--------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
// Get all components
const components = ["battery", "motor", "fuel", "turbine"];
const propeller = document.getElementById("propeller");


const turbineBypass = document.getElementById("turbine-bypass");
const batteryBypass = document.getElementById("battery-bypass");

const transmissionSlider = document.getElementById("transmissionpower");

const clearButton = document.getElementById("clear-button");

const archName = document.getElementById("arch-name");
const archDesc = document.getElementById("arch-desc");
const archNote = document.getElementById("arch-note");

//Query Mode
const queryButton = document.getElementById("query-button")

const interactiveControls = [
    transmissionSlider,
    turbineBypass,
    batteryBypass,
    clearButton,
];


/* ---------------------------------------------------------------------------------------------------- */
/* -----------------------------------------Event Listeners--------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */

components.forEach(id => {
    const el = document.getElementById(id);


    el.addEventListener("click", () => {
        if (queryMode) {
            //handleQueryClick(el, id);
        } else {
            el.classList.toggle("active"); // toggle green fill
            requestAnimationFrame(updateLineFlow);
        }
    });
});




transmissionSlider.addEventListener("input", () => {
    if (queryMode) return;

    transmissionFlag = getTransmissionFlag();
    updateLineFlow();
    const transmission = document.getElementById("transmission");

    if (transmissionFlag !== 0) {
        transmission.classList.add("active");
    } else {
        transmission.classList.remove("active");
    }
}
);


clearButton.addEventListener("click", () => {
    if (queryMode) return;
    // Turn off all components
    components.forEach(id => {
        document.getElementById(id).classList.remove("active");
    });

    // Reset transmission slider to Off (middle)
    transmissionSlider.value = 50;
    transmissionFlag = 0;
    transmission.classList.remove("active");

    // Have it uncheck the marks
    turbineBypass.checked = false;
    batteryBypass.checked = false;

    // Update visuals
    updateLineFlow();
});



turbineBypass.addEventListener("change", () => {
    if (queryMode) return;
    updateLineFlow();
});

batteryBypass.addEventListener("change", () => {
    if (queryMode) return;
    updateLineFlow();
});


const tooltip = document.getElementById("query-tooltip");


queryButton.addEventListener("click", () => {
    queryMode = !queryMode;

    // Update cursor style
    document.body.classList.toggle("query-mode", queryMode);

    interactiveControls.forEach(el => {
        el.classList.toggle("query-lock", queryMode);
    });

    tooltip.style.display = queryMode ? "block" : "none";

    // Close any open box if turning off
    if (!queryMode && activeInfoBox) {
        activeInfoBox.style.display = "none";
        activeInfoBox = null;
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && queryMode) {
        queryButton.click();
        if (activeInfoBox) {
            activeInfoBox.style.display = "none";
            activeInfoBox = null;
        }
    }
});




/* ---------------------------------------------------------------------------------------------------- */
/* ----------------------------------PULL IN VISUAL ELEMENTS----------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */

/* ----------------------------------BOXES----------------------------------------- */
const battery = document.getElementById("battery");
const motor = document.getElementById("motor");
const fuel = document.getElementById("fuel");
const turbine = document.getElementById("turbine");

/* ----------------------------------BATTERY TO BATTERY NODE LINES----------------------------------------- */
const baseLineBatteryBatterynode = document.getElementById("line-battery-batterynode");
const flowLineBatteryBatterynode = document.getElementById("flow-battery-batterynode");
const flowLineCharge = document.getElementById("charge-battery");

/* ----------------------------------FUEL TO TURBINE LINES----------------------------------------- */
const baseLineFuelTurbine = document.getElementById("line-fuel-turbine")
const flowLineFuelTurbine = document.getElementById("flow-fuel-turbine");

/* ----------------------------------TURBINE TO TURBINE NODE LINES----------------------------------------- */
const baseLineTurbineTurbineNodeLink = document.getElementById("line-turbine-turbinenode");
const flowLineTurbineTurbineNodeLink = document.getElementById("flow-turbine-turbinenode");

/* ----------------------------------TURBINE NODE TO THRUST NODE LINES----------------------------------------- */
const baseLineTurbineNodeThrustLink = document.getElementById("line-turbinenode-thrustlink");
const flowLineTurbineNodeThrustLink = document.getElementById("flow-turbinenode-thrustlink");

/* ----------------------------------BATTERY NODE TO MOTOR----------------------------------------- */
const baseLineBatteryNodeMotor = document.getElementById("line-batterynode-motor");
const flowLineBatteryNodeMotor = document.getElementById("flow-batterynode-motor");

/* ----------------------------------MOTOR TO THRUST NODE LINES----------------------------------------- */
const baseLineMotorThrustLink = document.getElementById("line-motor-thrustlink");
const flowLineMotorThrustLink = document.getElementById("flow-motor-thrustlink");

/* ----------------------------------THRUST NODE TO PROPELLER LINES----------------------------------------- */
const baseLineThrustLinkProp = document.getElementById("line-thrustLink-prop");
const flowLineThrustLinkProp = document.getElementById("flow-thrustLink-prop");

/* ----------------------------------TRANSMISSION TO TURBINE NODE LINES----------------------------------------- */
const baseLineTransmissionTurbineNode = document.getElementById("line-transmission-turbinenode");
const flowDOWNLineTransmissionTurbineNode = document.getElementById("flowDOWN-transmission-turbinenode");
const flowUPLineTransmissionTurbineNode = document.getElementById("flowUP-transmission-turbinenode");

/* ----------------------------------TRANSMISSION TO BATTERY NODE LINES----------------------------------------- */
const baseLineTransmissionBatteryNode = document.getElementById("line-transmission-batterynode");
const flowDOWNLineTransmissionBatteryNode = document.getElementById("flowDOWN-transmission-batterynode");
const flowUPLineTransmissionBatteryNode = document.getElementById("flowUP-transmission-batterynode");

/* ------------------------------------------NO POWER IMAGES-------------------------------------------- */
const turbineNoPower = document.getElementById("no-power-turbine");
const motorNoPower = document.getElementById("no-power-motor");

const transmissionNoPowerDOWN = document.getElementById("no-power-transmission-down");
const transmissionNoPowerUP = document.getElementById("no-power-transmission-up")





function getTransmissionFlag() {
    const val = parseInt(transmissionSlider.value);
    if (val > 55) return 1;
    if (val < 45) return -1;
    return 0;
}



function updateFlags() {
    transmissionFlag = getTransmissionFlag()
    turbineBypassOn = turbineBypass.checked;
    batteryBypassOn = batteryBypass.checked;
    batteryOn = battery.classList.contains("active");
    fuelOn = fuel.classList.contains("active");
    turbineClick = turbine.classList.contains("active");
    motorClick = motor.classList.contains("active");

    /* -------------------------------------------TURBINE ACTIVE STATUS--------------------------------------------------------- */
    /* Initialize Flag */

    /* If no fuel but user set turbine on, set flag to false and show no-power image*/
    if (!fuelOn && turbineClick) {
        turbineOn = 0
        turbineNoPower.style.visibility = "visible";
    }
    /* If fuel and user set turbine on, set flag to true and make sure no-power image is hidden*/
    else if (fuelOn && turbineClick) {
        turbineOn = 1
        turbineNoPower.style.visibility = "hidden";
    }
    /* otherwise, set flag to false but we arent requesting power from it so no-power image is hidden*/
    else {
        turbineOn = 0
        turbineNoPower.style.visibility = "hidden";
    }


    /* -------------------------------------------- TURBINE NODE FLAG---------------------------------------------- */
    if (transmissionFlag === 1) {
        if (batteryOn || turbineOn) {
            turbineNodeOn = 1
        } else {
            turbineNodeOn = 0
        }
    } else if (transmissionFlag === 0) {
        if (turbineOn) {
            turbineNodeOn = 1
        } else {
            turbineNodeOn = 0
        }
    } else if (transmissionFlag === -1) {
        if (turbineOn) {
            if (turbineBypassOn) {
                turbineNodeOn = 1
            }
            else if (!turbineBypassOn) {
                turbineNodeOn = 0
            }
        } else {
            turbineNodeOn = 0
        }
    }

    /* -------------------------------------------- BATTERY NODE FLAG---------------------------------------------- */
    if (transmissionFlag === -1) {
        if (turbineOn || batteryOn) {
            batteryNodeOn = 1
        } else {
            batteryNodeOn = 0
        }
    } else if (transmissionFlag === 0) {
        if (batteryOn) {
            batteryNodeOn = 1
        } else {
            batteryNodeOn = 0
        }
    } else if (transmissionFlag === 1) {
        if (batteryOn) {
            if (batteryBypassOn) {
                batteryNodeOn = 1
            } else if (!batteryBypassOn) {
                batteryNodeOn = 0
            }
        } else {
            batteryNodeOn = 0
        }
    }

    /* ---------------------------------------MOTOR ACTIVE STATUS------------------------------------------------------------- */

    /* If no fuel but user set turbine on, set flag to false and show no-power image*/
    if (!batteryNodeOn && motorClick) {
        motorOn = 0
        motorNoPower.style.visibility = "visible";
    }
    /* If fuel and user set turbine on, set flag to true and make sure no-power image is hidden*/
    else if (batteryNodeOn && motorClick) {
        motorOn = 1
        motorNoPower.style.visibility = "hidden";
    }
    /* otherwise, set flag to false but we arent requesting power from it so no-power image is hidden*/
    else {
        motorOn = 0
        motorNoPower.style.visibility = "hidden";
    }

    if (motorOn || turbineNodeOn === 1) {
        propellerSpin = 1
    } else {
        propellerSpin = 0
    }
}







/* ---------------------------------------------------------------------------------------------------- */
/* ----------------------------------LINE FLOW UPDATE FUNCTION----------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */

function updateLineFlow() {

    updateFlags();

    transmissionFlag = getTransmissionFlag()
    turbineBypassOn = turbineBypass.checked;
    batteryBypassOn = batteryBypass.checked;
    batteryOn = battery.classList.contains("active");
    fuelOn = fuel.classList.contains("active");
    turbineClick = turbine.classList.contains("active");
    motorClick = motor.classList.contains("active");


    /* ---------------------------------------FUEL LINE------------------------------------------------------------- */
    /* Fuel Line */
    /* Very simple, just toggle visibility of flowing line and solid line depending on if the component is active */
    if (fuelOn) {
        baseLineFuelTurbine.style.visibility = "hidden";
        flowLineFuelTurbine.style.visibility = "visible";
    } else {
        baseLineFuelTurbine.style.visibility = "visible";
        flowLineFuelTurbine.style.visibility = "hidden";
    }


    /* --------------------------------------------TURBINE AND TURBINE NODE LINE---------------------------------------------- */

    if (turbineOn) {
        baseLineTurbineTurbineNodeLink.style.visibility = "hidden";
        flowLineTurbineTurbineNodeLink.style.visibility = "visible";
    } else {
        baseLineTurbineTurbineNodeLink.style.visibility = "visible";
        flowLineTurbineTurbineNodeLink.style.visibility = "hidden";
    }




    /* Transmission Lines */
    if (transmissionFlag === 1) {
        transmissionNoPowerDOWN.style.visibility = "hidden";
        if (batteryOn) {
            transmissionNoPowerUP.style.visibility = "hidden";
            baseLineTransmissionTurbineNode.style.visibility = "hidden";
            flowDOWNLineTransmissionTurbineNode.style.visibility = "hidden";
            flowUPLineTransmissionTurbineNode.style.visibility = "visible";
            baseLineTransmissionBatteryNode.style.visibility = "hidden";
            flowDOWNLineTransmissionBatteryNode.style.visibility = "hidden";
            flowUPLineTransmissionBatteryNode.style.visibility = "visible";

        } else {

            if (turbineOn) {
                transmissionNoPowerUP.style.visibility = "visible";
                baseLineTransmissionTurbineNode.style.visibility = "visible";
                flowDOWNLineTransmissionTurbineNode.style.visibility = "hidden";
                flowUPLineTransmissionTurbineNode.style.visibility = "hidden";
                baseLineTransmissionBatteryNode.style.visibility = "visible";
                flowDOWNLineTransmissionBatteryNode.style.visibility = "hidden";
                flowUPLineTransmissionBatteryNode.style.visibility = "hidden";
            }
            else {
                transmissionNoPowerUP.style.visibility = "visible";
                baseLineTransmissionTurbineNode.style.visibility = "visible";
                flowDOWNLineTransmissionTurbineNode.style.visibility = "hidden";
                flowUPLineTransmissionTurbineNode.style.visibility = "hidden";
                baseLineTransmissionBatteryNode.style.visibility = "visible";
                flowDOWNLineTransmissionBatteryNode.style.visibility = "hidden";
                flowUPLineTransmissionBatteryNode.style.visibility = "hidden";
            }
        }
    } else if (transmissionFlag === 0) {
        transmissionNoPowerDOWN.style.visibility = "hidden";
        transmissionNoPowerUP.style.visibility = "hidden";

        baseLineTransmissionTurbineNode.style.visibility = "visible";
        flowDOWNLineTransmissionTurbineNode.style.visibility = "hidden";
        flowUPLineTransmissionTurbineNode.style.visibility = "hidden";
        baseLineTransmissionBatteryNode.style.visibility = "visible";
        flowDOWNLineTransmissionBatteryNode.style.visibility = "hidden";
        flowUPLineTransmissionBatteryNode.style.visibility = "hidden";
    } else if (transmissionFlag === -1) {
        transmissionNoPowerUP.style.visibility = "hidden";



        if (turbineOn) {
            transmissionNoPowerDOWN.style.visibility = "hidden";
            baseLineTransmissionTurbineNode.style.visibility = "hidden";
            flowDOWNLineTransmissionTurbineNode.style.visibility = "visible";
            flowUPLineTransmissionTurbineNode.style.visibility = "hidden";
            baseLineTransmissionBatteryNode.style.visibility = "hidden";
            flowDOWNLineTransmissionBatteryNode.style.visibility = "visible";
            flowUPLineTransmissionBatteryNode.style.visibility = "hidden";

            if (turbineBypassOn) {
                baseLineTransmissionTurbineNode.style.visibility = "hidden";
                flowDOWNLineTransmissionTurbineNode.style.visibility = "visible";
            }
            else if (!turbineBypassOn) {
                baseLineTransmissionTurbineNode.style.visibility = "hidden";
                flowDOWNLineTransmissionTurbineNode.style.visibility = "visible";
            }
        } else {
            transmissionNoPowerDOWN.style.visibility = "visible";
            baseLineTransmissionTurbineNode.style.visibility = "visible";
            flowDOWNLineTransmissionTurbineNode.style.visibility = "hidden";
            flowUPLineTransmissionTurbineNode.style.visibility = "hidden";
            baseLineTransmissionBatteryNode.style.visibility = "visible";
            flowDOWNLineTransmissionBatteryNode.style.visibility = "hidden";
            flowUPLineTransmissionBatteryNode.style.visibility = "hidden";
        }


    }

    /* --------------------------------------------BATTERY AND BATTERY NODE LINE---------------------------------------------- */
    /* Battery and BatteryNode Line  */
    if (!batteryOn && batteryBypassOn) {
        if (transmissionFlag === -1 && turbineOn) {
            baseLineBatteryBatterynode.style.visibility = "hidden";
            flowLineCharge.style.visibility = "visible";
            flowLineBatteryBatterynode.style.visibility = "hidden";
        } else {
            baseLineBatteryBatterynode.style.visibility = "visible";
            flowLineCharge.style.visibility = "hidden";
            flowLineBatteryBatterynode.style.visibility = "hidden";
        }
    } else if (batteryOn && batteryBypassOn) {
        if (transmissionFlag === -1 && turbineOn) {
            baseLineBatteryBatterynode.style.visibility = "hidden";
            flowLineCharge.style.visibility = "visible";
            flowLineBatteryBatterynode.style.visibility = "hidden";
        } else {
            baseLineBatteryBatterynode.style.visibility = "hidden";
            flowLineCharge.style.visibility = "hidden";
            flowLineBatteryBatterynode.style.visibility = "visible";
        }
    } else if (batteryOn && !batteryBypassOn) {
        baseLineBatteryBatterynode.style.visibility = "hidden";
        flowLineCharge.style.visibility = "hidden";
        flowLineBatteryBatterynode.style.visibility = "visible";
    } else {
        baseLineBatteryBatterynode.style.visibility = "visible";
        flowLineBatteryBatterynode.style.visibility = "hidden";
        flowLineCharge.style.visibility = "hidden";
    }

    /* -------------------------------------------- BATTERY NODE MOTOR LINE---------------------------------------------- */

    if (batteryNodeOn) {
        baseLineBatteryNodeMotor.style.visibility = "hidden";
        flowLineBatteryNodeMotor.style.visibility = "visible";
        if (transmissionFlag === 0) {
            if (batteryBypassOn) {
                baseLineTransmissionBatteryNode.style.visibility = "hidden";
                flowDOWNLineTransmissionBatteryNode.style.visibility = "hidden";
                flowUPLineTransmissionBatteryNode.style.visibility = "visible";
            }

        }
    } else {
        baseLineBatteryNodeMotor.style.visibility = "visible";
        flowLineBatteryNodeMotor.style.visibility = "hidden";
    }



    /* ---------------------------------------TURBINE NODE THRUST NODE LINE------------------------------------------------------------- */
    if (turbineNodeOn) {
        baseLineTurbineNodeThrustLink.style.visibility = "hidden";
        flowLineTurbineNodeThrustLink.style.visibility = "visible";
        if (transmissionFlag === 0) {
            if (turbineBypassOn) {
                baseLineTransmissionTurbineNode.style.visibility = "hidden";
                flowDOWNLineTransmissionTurbineNode.style.visibility = "visible";
                flowUPLineTransmissionTurbineNode.style.visibility = "hidden";
            }
        }
    } else {
        baseLineTurbineNodeThrustLink.style.visibility = "visible";
        flowLineTurbineNodeThrustLink.style.visibility = "hidden";
    }

    /* ---------------------------------------MOTOR THRUST NODE LINE------------------------------------------------------------- */

    if (motorOn) {
        baseLineMotorThrustLink.style.visibility = "hidden";
        flowLineMotorThrustLink.style.visibility = "visible";
    } else {
        baseLineMotorThrustLink.style.visibility = "visible";
        flowLineMotorThrustLink.style.visibility = "hidden";
    }

    /* ---------------------------------------THRUST NODE PROPELLER LINE AND PROPELLER SPIN------------------------------------------------------------- */


    if (propellerSpin) {
        baseLineThrustLinkProp.style.visibility = "hidden";
        flowLineThrustLinkProp.style.visibility = "visible";
    } else {
        baseLineThrustLinkProp.style.visibility = "visible";
        flowLineThrustLinkProp.style.visibility = "hidden";
    }

    if (propellerSpin) {
        propeller.classList.add("spinning");
        propeller.classList.add("active");
    } else {
        propeller.classList.remove("spinning");
        propeller.classList.remove("active");
    }



    /* ---------------------------------------  UPDATE NAME AND DESCRIPTION ------------------------------------------------------------- */

    archNote.textContent = "Note(s):";

    if (fuelOn && turbineOn && transmissionFlag === 0 && !motorOn) {
        archName.textContent = "Architecture: Conventional";
        archDesc.textContent = "A gas turbine, powered by jet fuel, spins a fan or a propeller. This is called a \"conventional\" architecture because it is the most commonnly used one in aircraft today.";


    } else if (fuelOn && turbineOn && transmissionFlag === 1 && batteryOn) {
        if (batteryBypassOn) {
            if (motorClick) {
                archName.textContent = "Architecture: Series-Parallel Hybrid";
                archDesc.textContent = "A gas turbine, powered by jet fuel and assisted by a transmission, provides propulsive power to the aircraft. A battery also provides power to an electric motor, which then spin a fan or a propeller. The use of both mechanical and electrical propulsion is what puts the \"parallel\" in this series-parallel configuration.";
                archNote.innerHTML += "<br> &bull; Differences between shaft or electrical connections can distinguish different variants of series-parallel hybrid architectures."

            } else {
                archName.textContent = "Architecture: Parallel Hybrid";
                archDesc.textContent = "A gas turbine, powered by jet fuel, spins a shaft assisted by battery powered transmission.";
                archNote.innerHTML += "<br> &bull; In this architecture, the transmission acts as an electric motor. Differences between shaft or electrical connections can distinguish different variants of parallel hybrid architectures."
            }
        } else {
            if (motorClick) {
                archName.textContent = "Architecture: Series-Parallel Hybrid";
                archDesc.textContent = "A gas turbine, powered by jet fuel and assisted by a transmission, provides propulsive power to the aircraft. A battery also provides power to an electric motor, which then spin a fan or a propeller. The use of both mechanical and electrical propulsion is what puts the \"parallel\" in this series-parallel configuration.";
                archNote.innerHTML += "<br> &bull; Differences between shaft or electrical connections can distinguish different variants of series-parallel hybrid architectures."

            } else {
                archName.textContent = "Architecture: Parallel Hybrid";
                archDesc.textContent = "A gas turbine, powered by jet fuel, spins a shaft assisted by battery powered transmission.";
                archNote.innerHTML += "<br> &bull; In this architecture, the transmission acts as an electric motor. Differences between shaft or electrical connections can distinguish different variants of parallel hybrid architectures."
            }
        }


    } else if (fuelOn && turbineOn && transmissionFlag === -1 && motorClick) {
        if (!batteryBypassOn) {
            if (!batteryOn) {
                if (turbineBypassOn) {
                    archName.textContent = "Architecture: Partially Turbo-electric";
                    archDesc.textContent = "A gas turbine, powered by jet fuel, spins a transmission, which supplies power to an electric motor. The electric motor then spins either a fan or a propeller. The gas turbine also provides direct propulsive power to the aircraft. NASA's SUSAN concept is an excellent example of this architecture. A partially turbo-electric architecture is a type of series-parallel hybrid.";
                } else { // Turbine Split Unchecked
                    archName.textContent = "Architecture: Fully Turbo-electric";
                    archDesc.textContent = "A gas turbine, powered by jet fuel, spins a transmission, which supplies power to an electric motor. The electric motor then spins either a fan or a propeller. A fully turbo-electric architecture is a more specific version of a series hybrid.";
                }
            }
            else { // Battery is on
                if (turbineBypassOn) {
                    archName.textContent = "Architecture: Series-Parallel Hybrid";
                    archDesc.textContent = "A gas turbine, powered by jet fuel, spins a transmission, which supplies power to an electric motor. A battery also provides power to the electric motor. The electric motor then spins either a fan or a propeller. The gas turbine also provides direct propulsive power to the aircraft. The use of both mechanical and electrical propulsion is what puts the \"parallel\" in this series-parallel configuration.";
                    archNote.innerHTML += "<br> &bull; Differences between shaft or electrical connections can distinguish different variants of series-parallel hybrid architectures."

                } else {
                    archName.textContent = "Architecture: Series Hybrid";
                    archDesc.textContent = "A gas turbine, powered by jet fuel, spins a transmission, which alongside a battery, supplies power to an electric motor. The electric motor then spins either a fan or a propeller. Since only electrical propulsion is used, even though it is partially powered by fuel, is what makes this architecture a series.";
                }
            }
        } else { // Battery Bypass is active
            if (!batteryOn) {
                if (turbineBypassOn) {
                    archName.textContent = "Architecture: Partially Turbo-electric";
                    archDesc.textContent = "A gas turbine, powered by jet fuel, spins a transmission, which supplies power to an electric motor, which spins a fan or a propeller. The gas turbine also provides direct propulsive power. NASA's SUSAN concept is an excellent example of this architecture. A partially turbo-electric architecture is a type of series-parallel hybrid.";
                } else {
                    archName.textContent = "Architecture: Fully Turbo-electric";
                    archDesc.textContent = "A gas turbine, powered by jet fuel, spins a transmission, which supplies power to an electric motor, which spins a fan or a propeller. A fully turbo-electric architecture is a more specific version of a series hybrid.";
                }
            } else { // Battery Inactive, but battery split active (charge mode)
                if (turbineBypassOn) {
                    archName.textContent = "Architecture: Series-Parallel Hybrid (Charging Mode)";
                    archDesc.textContent = "A gas turbine, powered by jet fuel, spins a transmission, which supplies power to an electric motor. A battery also provides power to the electric motor. The electric motor then spins either a fan or a propeller. The gas turbine also provides direct propulsive power to the aircraft. The use of both mechanical and electrical propulsion is what puts the \"parallel\" in this series-parallel configuration.";

                } else {
                    archName.textContent = "Architecture: Series Hybrid (Charging Mode)";
                    archDesc.textContent = "A gas turbine, powered by jet fuel, spins a transmission, which alongside a battery, supplies power to an electric motor. The electric motor then spins either a fan or a propeller. Since only electrical propulsion is used, even though it is partially powered by fuel, is what makes this architecture a series.";
                }
            }
        }
    } else if (fuelOn && turbineOn && transmissionFlag === -1 && !motorClick && turbineBypassOn) {
        archName.textContent = "Architecture: Conventional";
        archDesc.textContent = "A gas turbine, powered by jet fuel, spins a fan or a propeller. This is called a \"conventional\" architecture because it is the most commonnly used one in aircraft today.";
        archNote.innerHTML += "<br> &bull; Transmission is adding unneccessary weight to the propulsion system."
        if (batteryOn) {
            archNote.innerHTML += "<br> &bull; Battery is adding unneccessary weight to the propulsion system."
        }
    } else if (fuelOn && turbineOn && batteryOn && motorOn && transmissionFlag == 0) {
        archName.textContent = "Architecture: Parallel Hybrid";
        archDesc.textContent = "A gas turbine, powered by jet fuel, spins a shaft assisted by battery powered electric motor.";
        archNote.innerHTML += "<br> &bull; Differences between shaft or electrical connections can distinguish different variants of parallel hybrid architectures."
    } else if (!fuelOn && !turbineOn && batteryOn && motorOn) {
        archName.textContent = "Architecture: Fully Electric";
        archDesc.textContent = "A battery powers an electric motor, which spins a fan or a propeller.";
    } else if (!fuelOn && !turbineOn && batteryOn && transmissionFlag === 1) {
        archName.textContent = "Architecture: Fully Electric";
        archDesc.textContent = "A battery powers an electric motor and a transmission, which can spin separate propulsors, or combine their power to spin any number of propulsors, which may be beneficial to make sure there are redundant systems for safety!";
        archNote.innerHTML += "<br> &bull; In this architecture, the transmission acts as an electric motor."
    } else if (fuelOn && turbineOn && !batteryOn && transmissionFlag === 1) {
        archName.textContent = "Architecture: Conventional";
        archDesc.textContent = "A gas turbine, powered by jet fuel, spins a fan or a propeller. This is called a \"conventional\" architecture because it is the most commonnly used one in aircraft today.";
        archNote.innerHTML += "<br> &bull; Transmission is adding unneccessary weight to the propulsion system."

        if (motorClick) {
            archNote.innerHTML += "<br> &bull; Motor is adding unneccessary weight to the propulsion system."
        }

    } else if (fuelOn && !turbineOn && batteryOn && transmissionFlag === 1) {

        if (batteryBypass){
        archName.textContent = "Architecture: Fully Electric";
        archDesc.textContent = "A battery powers an electric motor and a transmission, which can spin separate propulsors, or combine their power to spin any number of propulsors, which may be beneficial to make sure there are redundant systems for safety!";
        archNote.innerHTML += "<br> &bull; In this architecture, the transmission acts as an electric motor."
        } else {
            archName.textContent = "Architecture: Fully Electric";
            archDesc.textContent = "A battery powers a transmission, which spins a fan or a propeller.";
            archNote.innerHTML += "<br> &bull; In this architecture, the transmission acts as an electric motor."
        }


    } else if (fuelOn && !turbineOn && batteryOn && transmissionFlag === 0) {
        archName.textContent = "Architecture: Fully Electric";
        archDesc.textContent = "A battery powers an electric motor, which spins a fan or a propeller.";


    } else {
        archName.textContent = "Architecture: —";
        archDesc.textContent = "Select components and set power flow to define an architecture.";
    }

    if (transmissionFlag == 1 && !batteryOn) {
        archNote.innerHTML += "<br> &bull; Transmission is expecting power, but not receiving any."
    }

    if (transmissionFlag == -1 && !turbineOn) {
        archNote.innerHTML += "<br> &bull; Transmission is expecting power, but not receiving any."
    }

    if (motorClick && !batteryNodeOn) {
        archNote.innerHTML += "<br> &bull; Electric motor is expecting power, but not receiving any."
        archNote.innerHTML += "<br> &bull; Electric motor is adding unnecessary weight to the propulsion system."
    }

    if (!motorClick && batteryNodeOn) {
        archNote.innerHTML += "<br> &bull; Electric motor is receiving power, but not sending it anywhere."
    }

    if (batteryBypassOn && transmissionFlag === -1) {
        archNote.innerHTML += "<br> &bull; Splitting battery power conflicts with downward transmission power flow. This configuration can be used to charge a battery!"
    }

    if (batteryBypassOn && transmissionFlag === -1 && !batteryOn) {
        archNote.innerHTML += "<br> &bull; Battery split and transmission settings expect a battery in this architecture, but none exists. It is recommended to either add the battery or turn off the split battery power setting."
    }

    if (turbineClick && !fuelOn) {
        archNote.innerHTML += "<br> &bull; Turbine is expecting power, but not receiving any."
    }

    if (!turbineClick && fuelOn) {
        archNote.innerHTML += "<br> &bull; Turbine is receiving power, but not sending it anywhere."
        archNote.innerHTML += "<br> &bull; Unused fuel is adding unnecessary weight to the propulsion system."
    }

    if (batteryOn && transmissionFlag === 0 && batteryBypassOn) {
        archNote.innerHTML += "<br> &bull; Transmission is receiving power, but not sending it anywhere."

    }

    if (turbineOn && transmissionFlag === 1 && turbineBypassOn) {
        archNote.innerHTML += "<br> &bull; Turbine power split and transmission powerflow settings are conflicting."

    }

    if (turbineOn && transmissionFlag === 0 && turbineBypassOn) {
        archNote.innerHTML += "<br> &bull; The turbine expects a transmission here, but isn't finding one."

    }


}
