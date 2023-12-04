using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Character : MonoBehaviour
{
    
    public float amplitudeY;
    public float frequencyY;
    public float rangeX;
    public float speedX; 
    public GameObject[] states;
    private Vector3 startPosition;
    private bool movingRight = true;

    void Start()
    {
        startPosition = transform.position;
    }

    void Update()
    {
        float newY = startPosition.y + amplitudeY * Mathf.Sin(Time.time * frequencyY);
        if (movingRight)
        {
            if (transform.position.x >= startPosition.x + rangeX)
                movingRight = false;
        }
        else
        {
            if (transform.position.x <= startPosition.x - rangeX)
                movingRight = true;
        }

        float newX = transform.position.x + (movingRight ? speedX : -speedX) * Time.deltaTime;
        newX = Mathf.Clamp(newX, startPosition.x - rangeX, startPosition.x + rangeX);
        transform.position = new Vector3(newX, newY, transform.position.z);

        if (!movingRight)
        {
            transform.rotation = Quaternion.Euler(0, 180, 0);
        }
        else
        {
            transform.rotation = Quaternion.Euler(0, 0, 0);
        }
    }

    public bool isValidState(int state)
    {
        return state >= 0 && state < states.Length;
    }

    public void ChangeState(int state)
    {
        for (int i = 0; i < states.Length; i++)
        {
            states[i].SetActive(false);
        }
        states[state].SetActive(true);
    }
}
