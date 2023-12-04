using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public int humanityScore;
    public Character character;

    void Update()
    {
        if(character.isValidState(humanityScore))
        {
            character.ChangeState(humanityScore);
        }
    }
}
