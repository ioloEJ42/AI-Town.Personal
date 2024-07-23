import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Button from './buttons/Button';
import http from '../../convex/http';
import { httpAction } from '../../convex/_generated/server';
import { Id } from '../../convex/_generated/dataModel';
import { get } from 'http';

export default function DownloadButton() {
  const stopAllowed = useQuery(api.testing.stopAllowed) ?? false;
  const defaultWorld = useQuery(api.world.defaultWorldStatus);

  const frozen = defaultWorld?.status === 'stoppedByDeveloper';

  const getit = useQuery(api.messages.listallMessages);

  const flipSwitch = async () => {
      // Content of the text file
      const jsonData = getit;
    
      const jsonString = JSON.stringify(jsonData, null, 2);


      interface Message {
        authorName: any;
        _id: Id<"messages">;
        _creationTime: number;
        worldId?: Id<"worlds">;
        conversationId: string;
        messageUuid: string;
        author: string;
        text: string;
    }
    const conversations: { [key: string]: Message[] } = {};
    const messages = jsonData
    console.log()

    if (messages != null){
      
      messages.forEach(message => {
        
        const conversationID = String(message.conversationId);
        if (!conversations[conversationID]) {
          conversations[conversationID] = [];
      }
        conversations[conversationID].push(message);
      });
      console.log(conversations)

    const organizedJson = JSON.stringify(conversations, null, 4);
          // Create a blob with the JSON string
      const blob = new Blob([organizedJson], { type: 'application/json' });
  
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
  
      // Create an anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json'; // Set the desired file name
  
      // Append the anchor to the body
      document.body.appendChild(a);
  
      // Trigger the download by simulating a click
      a.click();
  
      // Remove the anchor from the document
      document.body.removeChild(a);
  
      // Release the object URL to free up memory
      URL.revokeObjectURL(url);
    
    }


      
  };
  return !stopAllowed ? null : (
    <>
      <Button
        onClick={flipSwitch}
        className="hidden lg:block"
        title="Download a table of messages."
        imgUrl="/assets/star.svg"
      >
        {frozen ? 'download' : 'download'}
      </Button>
    </>
  );
}
