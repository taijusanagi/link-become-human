using System;
using System.Numerics;
using System.Security.Cryptography;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using TMPro;

[System.Serializable]
public class TheGraphResponse
{
    public Data data;
}

[System.Serializable]
public class Data
{
    public Transfer[] transfers;
    public HumanityScoreUpdated[] humanityScoreUpdateds;
    public SeedUpdated[] seedUpdateds;
}

[System.Serializable]
public class Transfer
{
    public string tokenId;
}

[System.Serializable]
public class HumanityScoreUpdated
{
    public string humanityScore;
}

[System.Serializable]
public class SeedUpdated
{
    public string seed;
}

public class GameManager : MonoBehaviour
{
    public string tokenId;
    public bool isMinted;
    public float humanityScore;
    public string seed;

    public TextMeshProUGUI isMintedText;
    public TextMeshProUGUI humanityScoreText;
    public TextMeshProUGUI seedText;    

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
        transfers(
            where: {tokenId: """ + tokenId + @"""}
        ) {
            tokenId
        }
        humanityScoreUpdateds(
            orderBy: blockNumber
            orderDirection: desc
            first: 1
            where: {tokenId: """ + tokenId + @"""}
        ) {
            humanityScore
        }
        seedUpdateds(
            orderBy: blockNumber
            orderDirection: desc
            first: 1
            where: {tokenId: """ + tokenId + @"""}
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
                TheGraphResponse response = JsonUtility.FromJson<TheGraphResponse>(request.downloadHandler.text);
                if (response.data.transfers.Length > 0)
                {
                    Debug.Log("Token id: " + tokenId + " is minted");
                    isMinted = true;
                } else {
                    Debug.Log("Token id: " + tokenId + " is not minted");
                    isMinted = false;
                }
                if (response.data.humanityScoreUpdateds.Length > 0)
                {
                    humanityScore = float.Parse(response.data.humanityScoreUpdateds[0].humanityScore);
                    Debug.Log("Humanity Score: " + humanityScore);
                } else {
                    Debug.Log("Humanity Score is not fetched");
                    humanityScore = 0;
                }
                if (response.data.seedUpdateds.Length > 0)
                {
                    seed = response.data.seedUpdateds[0].seed;
                    Debug.Log("Seed: " + seed);
                } else {
                    Debug.Log("Seed is not fetched");
                    seed = "0";
                }
            }
        }
    }

    void Update()
    {
        isMintedText.text = "Is Minted: " + isMinted;
        humanityScoreText.text = "Humanity Score: " + humanityScore;
        string displaySeed = seed.Length > 5 ? seed.Substring(0, 5) + "..." : seed;
        seedText.text = "Seed: " + displaySeed;
        if(tokenId != "" && isMinted)
        {
            int state = Mathf.FloorToInt(humanityScore / 2.5f);
            state = Mathf.Clamp(state, 0, 8);
            if(character.isValidState(state))
            {
                character.ChangeState(state);
                if(state == 8){
                    if(seed != "0"){
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
