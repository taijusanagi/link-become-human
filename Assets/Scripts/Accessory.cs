using UnityEngine;

public class Accessory : MonoBehaviour
{

    public Sprite[] sprites;
    private SpriteRenderer spriteRenderer;

    void Start()
    {
        spriteRenderer = GetComponent<SpriteRenderer>();
    }
    
    public void ChangeSprite(int index)
    {
        if(spriteRenderer != null) {
            spriteRenderer.sprite = sprites[index];
        }
    }
}
