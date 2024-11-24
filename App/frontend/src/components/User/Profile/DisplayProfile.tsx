import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faDumbbell,
  faMars,
  faVenus,
  faWeight,
} from "@fortawesome/free-solid-svg-icons";
import { faRulerVertical } from "@fortawesome/free-solid-svg-icons/faRulerVertical";

//CSS
import "../../../Style/displayprofile.css";

// Import MUI components
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

//Animation
import { useSpring, animated } from "react-spring";
import { UserInfo } from "../../../Interfaces/interfaces";

interface NumberProps {
  n: number;
  delay?: number;
  unit?: string;
}

const DisplayProfile: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notSafe, setNotSafe] = useState<boolean>(false);
  const [isEditingEnabled, setIsEditingEnabled] = useState<boolean>(false);

  // Ensure 'user' is available
  if (!user) {
    return <p>User is not available.</p>;
  }

  // Editing states
  const [editingFields, setEditingFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});

  // Icons
  const scalesIcon = <FontAwesomeIcon icon={faWeight} />;
  const male = <FontAwesomeIcon icon={faMars} />;
  const female = <FontAwesomeIcon icon={faVenus} />;
  const birthdayIcon = <FontAwesomeIcon icon={faCakeCandles} />;
  const rulerIcon = <FontAwesomeIcon icon={faRulerVertical} />;
  const activeIcon = <FontAwesomeIcon icon={faDumbbell} />;

  // Function to calculate age
  const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Function to check if the weight goal is safe
  const checkGoalWeight = () => {
    const currentWeight = parseFloat(fieldValues.currentWeight);
    const weightGoal = parseFloat(fieldValues.weightGoal);
    console.log("Current Weight:", currentWeight, "Weight Goal:", weightGoal);

    if (weightGoal < 0.8 * currentWeight) {
      setNotSafe(true);
    } else {
      setNotSafe(false);
    }
  };

  const Number: React.FC<NumberProps> = ({ n, delay = 200, unit = "" }) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay,
      config: { mass: 1, tension: 20, friction: 15 },
    });

    return (
      <animated.div>
        {number.to((value) => `${value.toFixed(0)}${unit}`)}
      </animated.div>
    );
  };

  const getActivityDescription = (level: number): string => {
    switch (level) {
      case 1:
        return "Faible activité physique : vous êtes peu actif, avec peu ou pas d'exercice physique.";
      case 2:
        return "Activité physique modérée : vous pratiquez une activité physique régulière, comme la marche rapide ou une séance de sport modérée.";
      case 3:
        return "Activité physique intense : vous êtes très actif, avec des entraînements sportifs réguliers ou intensifs.";
      default:
        return "Niveau d'activité inconnu : veuillez vérifier vos informations.";
    }
  };

  const getUserInfo = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/users/${user.id}`
      );
      if (response.data) {
        setUserInfo(response.data);
        setFieldValues({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          currentWeight: response.data.currentWeight.toString(),
          height: response.data.height.toString(),
          weightGoal: response.data.weightGoal.toString(),
          currentActive: response.data.currentActive.toString(),
          gender: response.data.gender,
          birthday: response.data.birthday,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setLoading(false);
    }
  };

  // Fetch user info on component mount
  useEffect(() => {
    getUserInfo();
  }, [user]);

  const handleFieldSave = async (fieldName: string) => {
    if (!userInfo) return;

    try {
      let updatedValue = fieldValues[fieldName];

      // Parse numeric fields
      if (
        fieldName === "currentWeight" ||
        fieldName === "height" ||
        fieldName === "weightGoal" ||
        fieldName === "currentActive"
      ) {
        updatedValue = parseFloat(fieldValues[fieldName]);
      }

      // Check if weight goal is safe when updating weightGoal or currentWeight
      if (fieldName === "weightGoal" || fieldName === "currentWeight") {
        checkGoalWeight();
      }

      let valueToUpdate = {
        [fieldName]: updatedValue,
      };

      console.log("Updating field:", valueToUpdate);

      await axios.patch(
        `http://localhost:3000/users/${user.id}`,
        valueToUpdate
      );

      setUserInfo({ ...userInfo, [fieldName]: updatedValue });
      setEditingFields({ ...editingFields, [fieldName]: false });
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
    }
  };

  const renderField = (
    fieldName: string,
    displayValue: React.ReactNode,
    inputType: string = "text",
    options: Array<{ value: any; label: string }> = []
  ) => {
    const isEditable = isEditingEnabled;
    const commonStyles: React.CSSProperties = {
      fontFamily: "inherit",
      fontSize: "inherit",
      color: "inherit",
      backgroundColor: isEditable ? "#f0f0f0" : "transparent",
      border: "none",
      outline: "none",
      padding: 0,
      margin: 0,
      cursor: isEditable ? "pointer" : "default",
    };

    if (editingFields[fieldName]) {
      if (options.length > 0) {
        // Render select
        return (
          <select
            style={commonStyles}
            value={fieldValues[fieldName]}
            onChange={(e) =>
              setFieldValues({
                ...fieldValues,
                [fieldName]: e.target.value,
              })
            }
            onBlur={() => handleFieldSave(fieldName)}
            autoFocus
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={{ color: "black" }}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      } else {
        // Render input
        return (
          <input
            type={inputType}
            style={commonStyles}
            value={fieldValues[fieldName]}
            onChange={(e) =>
              setFieldValues({
                ...fieldValues,
                [fieldName]: e.target.value,
              })
            }
            onBlur={() => handleFieldSave(fieldName)}
            autoFocus
          />
        );
      }
    } else {
      return (
        <span
          style={commonStyles}
          onClick={() => {
            if (isEditable) {
              setEditingFields({ ...editingFields, [fieldName]: true });
            }
          }}
        >
          {displayValue}
        </span>
      );
    }
  };

  return (
    <div className="container_display_profile">
      {loading ? (
        <p>Loading...</p>
      ) : userInfo ? (
        <div>
          <h1>Hello {userInfo.firstname} !</h1>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormGroup style={{ marginLeft: "auto" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isEditingEnabled}
                    onChange={() => setIsEditingEnabled(!isEditingEnabled)}
                  />
                }
                label="Modifier mon profil"
              />
            </FormGroup>
          </div>
          <div className="section">
            <div className="background" id="user">
              <p>
                Nom de famille: {renderField("lastname", userInfo.lastname)}
              </p>

              <p>Prénom: {renderField("firstname", userInfo.firstname)}</p>
              <p>
                {userInfo.gender === "MALE" ? male : female} Genre:{" "}
                {renderField(
                  "gender",
                  userInfo.gender === "MALE" ? "Homme" : "Femme",
                  "text",
                  [
                    { value: "MALE", label: "Homme" },
                    { value: "FEMALE", label: "Femme" },
                  ]
                )}
              </p>
              <p>
                {birthdayIcon} Anniversaire:{" "}
                {renderField(
                  "birthday",
                  `${new Date(
                    userInfo.birthday
                  ).toLocaleDateString()} (${calculateAge(
                    userInfo.birthday
                  )} ans)`,
                  "date"
                )}
              </p>
            </div>
            <div className="background" id="weight">
              <p>
                {scalesIcon} Poids actuel:{" "}
                {renderField(
                  "currentWeight",
                  <Number n={userInfo.currentWeight} delay={5} unit=" Kg" />,
                  "number"
                )}
              </p>

              <p>
                {scalesIcon} Objectif de poids :{" "}
                {renderField(
                  "weightGoal",
                  <Number n={userInfo.weightGoal} delay={30} unit=" Kg" />,
                  "number"
                )}
              </p>
            </div>
            <div className="background" id="height">
              <p>
                {rulerIcon} Taille :{" "}
                {renderField(
                  "height",
                  <Number n={userInfo.height} delay={20} unit="cm" />,
                  "number"
                )}
              </p>

              <p>
                {activeIcon} Niveau d'activité :{" "}
                {renderField(
                  "currentActive",
                  getActivityDescription(parseInt(fieldValues.currentActive)),
                  "text",
                  [
                    { value: "1", label: "Faible activité physique" },
                    { value: "2", label: "Activité physique modérée" },
                    { value: "3", label: "Activité physique intense" },
                  ]
                )}
              </p>
            </div>
          </div>

          {/* Display warning if weight goal is not safe */}
          {notSafe && (
            <p className="alert">
              Attention: Votre objectif de poids est inférieur de plus de 20%
              par rapport à votre poids actuel. Veuillez consulter un
              professionnel de la santé.
            </p>
          )}
        </div>
      ) : (
        <p>User information not available.</p>
      )}
    </div>
  );
};

export default DisplayProfile;
