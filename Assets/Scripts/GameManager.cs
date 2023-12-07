using System;
using System.Numerics;
using System.Security.Cryptography;
using UnityEngine;

public class GameManager : MonoBehaviour
{

    public string tokenId;
    public bool isMinted;
    public float humanityScore;
    public string seed;

    public Character character;
    public Accessory hat;
    public Accessory eyeglass;

    private readonly string endpointURL = "https://api.studio.thegraph.com/proxy/60667/linkbecomehuman/v0.0.1/graphql";

    void Update()
    {
        if(tokenId != "" && isMinted)
        {
            int state = Mathf.FloorToInt(humanityScore / 2.5f);
            state = Mathf.Clamp(state, 0, 8);
            if(character.isValidState(state))
            {
                character.ChangeState(state);
                if(state == 8){
                    if(seed != ""){
                        byte[] bytes = BigInteger.Parse(seed, System.Globalization.NumberStyles.HexNumber).ToByteArray();
                        using (SHA256 sha256 = SHA256.Create())
                        {
                            byte[] hash = sha256.ComputeHash(bytes);
                            int intSeed = BitConverter.ToInt32(hash, 0);
                            intSeed = Math.Abs(intSeed % int.MaxValue);
                            UnityEngine.Random.InitState(intSeed);
                            int hatIndex = UnityEngine.Random.Range(0, hat.sprites.Length);
                            hat.ChangeSprite(hatIndex);
                            int eyeglassIndex = UnityEngine.Random.Range(0, eyeglass.sprites.Length);
                            eyeglass.ChangeSprite(eyeglassIndex);
                        }
                    }
                }

            }
        }
    }


}
