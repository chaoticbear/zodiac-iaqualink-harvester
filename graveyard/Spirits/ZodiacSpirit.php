<?php
namespace Graveyard\Spirits;

use Graveyard\Spirits\Spirit;

use DOMDocument;

class ZodiacSpirit extends Spirit
{
    public function harvestIAquaLink()
    {
        die('RESOLVED' . PHP_EOL);
    }

    protected function walkSiblingUntilNotTag($siblingNode, $tag)
    {
        if($siblingNode->tagName == $tag) {
            return array_merge(
                [$siblingNode->nodeValue],
                $this->walkSiblingUntilNotTag($siblingNode->nextSibling, $tag)
            );
        }
        return [];
    }
}
