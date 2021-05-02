using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TimerUI : MonoBehaviour
{
    public Text text;

    public void SetTime(float time) {
        int minutes = (int) time / 60;
        float seconds = time - 60 * minutes;
        text.text = string.Format("{0:00}:{1:00.00}", minutes, seconds);
    }
}
