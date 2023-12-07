using System;
using System.Numerics;
using System.Security.Cryptography;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

public class GameManager : MonoBehaviour
{
    public string tokenId;
    public bool isMinted;
    public float humanityScore;
    public string seed;
    

    public Character character;
    public Accessory hat;
    public Accessory eyeglass;

    private readonly string endpointURL = "https://api.studio.thegraph.com/query/60667/linkbecomehuman/v0.0.1";
    private float interval = 5f;

    // get token id from url
    void Start()
    {
        int pm = Application.absoluteURL.IndexOf("?");
        if (pm != -1)
        {
            string queryParams = Application.absoluteURL.Split('?')[1];
            string[] parameters = queryParams.Split('&');
            foreach (string param in parameters)
            {
                if (param.StartsWith("id="))
                {
                    tokenId = param.Substring(3);
                    break;
                }
            }
        }
        else
        {
            Debug.Log("No query parameters provided");
        }
        InvokeRepeating("RepeatedFetch", 0, interval);
    }

    void RepeatedFetch()
    {
        Debug.Log("RepeatedFetch");
        if (!string.IsNullOrEmpty(tokenId))
        {
            Debug.Log("Fetching data for token id: " + tokenId);
            StartCoroutine(GetDataFromTheGraph());
        }
        else
        {
            Debug.Log("Token id is not set");
        }
    }

    IEnumerator GetDataFromTheGraph()
    {
        string query = @"
        {
        humanityScoreUpdateds(
            orderBy: blockNumber
            orderDirection: desc
            first: 1
            where: {tokenId: ""1""}
        ) {
            humanityScore
        }
        seedUpdateds(
            orderBy: blockNumber
            orderDirection: desc
            first: 1
            where: {tokenId: ""1""}
        ) {
            seed
        }
        }";
        string jsonData = "{\"query\":\"" + query.Replace("\n", " ").Replace("\"", "\\\"") + "\"}";
        Debug.Log("jsonData:" + jsonData);
        using (UnityWebRequest request = new UnityWebRequest(endpointURL, "POST"))
        {
            byte[] jsonToSend = new System.Text.UTF8Encoding().GetBytes(jsonData);
            request.uploadHandler = (UploadHandler)new UploadHandlerRaw(jsonToSend);
            request.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            yield return request.SendWebRequest();
            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Error: " + request.error);
            }
            else
            {
                Debug.Log("Received: " + request.downloadHandler.text);
                // Here you can handle the JSON response as needed
            }
        }
    }

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
