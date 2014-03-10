<?php

namespace FritWork\Model\Entity;

class Friendship {

    public $source;
    public $target;

    public function __construct($source, $target) {
        if ($source > $target) {
            $a = $source;
            $source = $target;
            $target = $a;
        }
        
        $this->source=$source;
        $this->target=$target;
    }

   

}

?>
