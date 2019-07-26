<?php
namespace Graveyard\Spirits;

use Graveyard\Spirits\Spirit;
use Specter\Apparition;
use Specter\Redis;

use HeadlessChromium\BrowserFactory;
use DOMDocument;

class ZodiacSpirit extends Spirit
{
    public function harvestIAquaLink()
    {
        $pid = 38375;
        $key = 'dgpid_' . $pid . '_html';
        $v = Redis::obj()->get($key);
        if (empty($v)) {
            $bf = new BrowserFactory('chromium');
            $b = $bf->createBrowser();
            $p = $b->createPage();
            $p->navigate('https://davesgarden.com/guides/pf/go/' . $pid)
                ->waitForNavigation();
            $page = $p->evaluate('document.documentElement.innerHTML')->getReturnValue();
            if (!empty($page)) {
                $page = '<html>' . $page . '</html>';
                $doc = new DOMDocument();
                libxml_use_internal_errors(true);
                $doc->loadHTML($page);
                libxml_use_internal_errors(false);
                $htm = $doc->saveHTML();
                if (!empty($htm)) {
                    Redis::obj()->setEx(
                        $key,
                        2700,
                        $htm);
                    $v = $htm;
                }
            }
        }
        if (!empty($v)) {
            $doc = new DOMDocument();
            libxml_use_internal_errors(true);
            $doc->loadHTML($v);
            libxml_use_internal_errors(false);

            echo 'Page Id: ' . $pid . PHP_EOL;

            $h1s = $doc->getElementsByTagName('h1');
            var_dump($h1s[0]->textContent);

            $h2s = $doc->getElementsByTagName('h2');
            var_dump($h2s[0]->textContent);

            $interestingH4s = [
                'Category:',
                'Water Requirements:',
                'Sun Exposure:',
                'Foliage:',
                'Foliage Color:',
                'Height:',
                'Spacing:',
                'Hardiness:',
                'Where to Grow:',
                'Danger:',
                'Bloom Color:',
                'Bloom Characteristics:',
                'Bloom Size:',
                'Bloom Time:',
                'Other details:',
                'Soil pH requirements:',
                'Patent Information:',
                'Propagation Methods:',
                'Seed Collecting:',
                'Regional',
            ];
            foreach($doc->getElementsByTagName('h4') as $h4) {
                if (in_array(trim($h4->nodeValue), $interestingH4s)) {
                    echo $h4->nodeValue . PHP_EOL;
                    var_dump($this->walkSiblingUntilNotTag($h4->nextSibling, 'p'));
                }
            }

            $interestingTds = [
                'Family:',
                'Genus:',
                'Species:',
            ];
            foreach($doc->getElementsByTagName('td') as $td) {
                if (in_array(trim($td->nodeValue), $interestingTds)) {
                    echo $td->nodeValue . PHP_EOL;
                    var_dump(trim(str_replace('(Info)','',$td->nextSibling->nextSibling->textContent)));
                }
            }

            //$doc->saveHTMLFile('/tmp/' . $pid . '.html');
        }
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
