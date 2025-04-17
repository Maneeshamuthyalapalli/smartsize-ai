import cv2
import mediapipe as mp
import numpy as np

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

def estimate_pose(image_path):
    pose = mp_pose.Pose(static_image_mode=True)
    
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Image not found or unreadable")
    
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)

    if results.pose_landmarks:
        annotated_image = image.copy()
        mp_drawing.draw_landmarks(
            annotated_image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
        )
        return annotated_image, results.pose_landmarks
    else:
        return None, None
