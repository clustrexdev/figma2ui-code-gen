def get_html_prompt(css_framework: str):
    """Return the prompt template for HTML generation"""
    prompt = """
        You are an expert HTML and JavaScript developer. I have a image that represents my design, and I need an exact HTML structure using Tailwind CSS without altering the layout or style and color profiles. And it is your responsibility to make sure that the HTML structure is responsive and works on all devices. The image is in the same directory as this script. The image name is 10-510.png. Please provide me with the HTML structure and the necessary script src links for Chart.js and Tailwind CSS.
        include necessary script src  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>.<script src="https://cdn.tailwindcss.com"></script>
        And Make it also functtional with Chart.js and Tailwind CSS. And make sure to include the necessary script src links for Chart.js and Tailwind CSS.

        Note: The image is a design of a dashboard. Please make sure that the HTML structure is responsive and works on all devices.
        The image is in the same directory as this script.
        And dont Leave any data or inforation in the image. Just provide me with the HTML structure and the necessary script src links for Chart.js and Tailwind CSS.
        Dont leave lineitems in the tables all elments should be in the table.

        Instructions:
        Your code will be evaluated by a human. Please make sure that your code is correct and follows the instructions.
        So think twice before you write the code.
        Use https://placehold.co/ for images
    """
    return prompt

def get_react_prompt(css_framework: str, ui_library: str, language : str):
    """Return the prompt template for React generation"""
    prompt = f"""
        You are an expert React developer. I have an image that represents my design, and I need an exact React component using {css_framework} without altering the layout or style and color profiles. 
        Make sure that the React component is responsive and works on all devices.
        
        {f'Use {ui_library} components where appropriate.' if ui_library != 'none' else ''}
        {f'The Code should be written in {language}'}
        
        Create a clean, well-structured React component that accurately represents this design.
        Include all necessary imports and dependencies.
        Use functional components with hooks where appropriate.
        Add proper comments to explain key sections of the code.
        
        Don't leave any placeholder data or information in the image. Just provide me with the complete React component.
        
        Instructions:
        Your code will be evaluated by a human. Please make sure that your code is correct and follows the instructions.
        Use https://placehold.co/ for images.
    """
    return prompt

def get_nextjs_prompt(css_framework: str, ui_library: str, language : str):
    """Return the prompt template for Next.js generation"""
    prompt = f"""
        You are an expert Next.js developer. I have an image that represents my design, and I need an exact Next.js component using {css_framework} without altering the layout or style and color profiles.
        Make sure that the Next.js component is responsive and works on all devices.
        
        {f'Use {ui_library} components where appropriate.' if ui_library != 'none' else ''}
        {f'The Code should be written in {language}'}
        Create a clean, well-structured Next.js component that accurately represents this design.
        Include all necessary imports and dependencies.
        Add proper comments to explain key sections of the code.
        Follow Next.js best practices for routing and data fetching.
        
        Don't leave any placeholder data or information in the image. Just provide me with the complete Next.js component.
        
        Instructions:
        Your code will be evaluated by a human. Please make sure that your code is correct and follows the instructions.
        Use https://placehold.co/ for images.
    """
    return prompt

def get_svelte_prompt(css_framework: str, ui_library : str):
    """Return the prompt template for Svelte generation"""
    prompt = f"""
        You are an expert Svelte developer. I have an image that represents my design, and I need an exact Svelte component using {css_framework} without altering the layout or style and color profiles.
        Make sure that the Svelte component is responsive and works on all devices.

        {f'Use {ui_library} components where appropriate.' if ui_library != 'none' else ''}
        
        Create a clean, well-structured Svelte component that accurately represents this design.
        Include all necessary imports and dependencies.
        Add proper comments to explain key sections of the code.
        
        Don't leave any placeholder data or information in the image. Just provide me with the complete Svelte component.
        
        Instructions:
        Your code will be evaluated by a human. Please make sure that your code is correct and follows the instructions.
        Use https://placehold.co/ for images.
    """
    return prompt

def get_react_native_prompt():
    """Return the prompt template for React Native generation"""
    prompt = """
        You are an expert React Native developer. I have an image that represents my design, and I need an exact React Native component that accurately represents this design without altering the layout or style and color profiles.
        Make sure that the React Native component works well on both iOS and Android.
        
        Create a clean, well-structured React Native component that accurately represents this design.
        Include all necessary imports and dependencies.
        Use functional components with hooks where appropriate.
        Add proper comments to explain key sections of the code.
        
        Don't leave any placeholder data or information in the image. Just provide me with the complete React Native component.
        
        Instructions:
        Your code will be evaluated by a human. Please make sure that your code is correct and follows the instructions.
    """
    return prompt