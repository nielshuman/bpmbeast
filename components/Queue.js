import { Accordion, AccordionItem, Card, CardBody } from "@nextui-org/react";
import Image from "next/image";

export default function Queue({results}) {
    return <Accordion variant="shadow">
        <AccordionItem title="Queue">
            {results.map(track => <>
                <Track key={track.id} track={track}></Track>
            </>)}
        </AccordionItem>
    </Accordion>
}

export function Track({track}) {
    return (
      <Card className="mb-3">
        <CardBody>
      <div className="flex items-center space-x-3"> {/* h-16 */}
        <div className="">
          {/* <Image src={track.album.images[0].url} width={50} height={50} /> */}
          <img src={track.album.images[0].url} alt={track.album.name} className="w-12 h-12 rounded-lg" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{track.name}</h3>
          <p className="text-sm text-gray-500">{track.album.title}</p>
          <p className="text-sm text-gray-500">BPM: {track.features.tempo}</p>
        </div>
        {/* TODO: Swipe gedoe */}
      </div>
        </CardBody>
      </Card>
    );
  }